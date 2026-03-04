import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const rawLine of content.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) {
        continue;
      }
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }
      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Intentionally ignore missing local env files.
  }
}

const parseYearFromText = (value) => {
  if (typeof value !== "string") {
    return "";
  }
  const match = value.match(/\b(19\d{2}|20\d{2})\b/);
  return match ? match[1] : "";
};

const escapeCloudinaryContextValue = (value) =>
  value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/=/g, "\\=");

const parseAltText = (resource) => {
  const altText = resource.context?.custom?.alt_text;
  if (typeof altText === "string" && altText.trim()) {
    return altText.trim();
  }
  const caption = resource.context?.custom?.caption;
  if (typeof caption === "string" && caption.trim()) {
    return caption.trim();
  }
  return "";
};

const parseYear = (resource) => {
  const year = resource.context?.custom?.year;
  if (typeof year === "string") {
    const trimmed = year.trim();
    if (/^(19\d{2}|20\d{2})$/.test(trimmed)) {
      return trimmed;
    }
  }
  return parseYearFromText(parseAltText(resource));
};

const parseDisplayOrder = (resource) => {
  const parsed = Number(resource.context?.custom?.display_order);
  return Number.isFinite(parsed) ? parsed : null;
};

async function listTaggedResources({ cloudName, apiKey, apiSecret, tag }) {
  const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const resources = [];
  let nextCursor = "";

  do {
    const query = new URLSearchParams({
      max_results: "500",
      context: "true",
      direction: "desc",
    });
    if (nextCursor) {
      query.set("next_cursor", nextCursor);
    }

    const endpoint =
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${encodeURIComponent(tag)}` +
      `?${query.toString()}`;
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Cloudinary list request failed for tag "${tag}": ${body}`);
    }

    const payload = await response.json();
    const batch = Array.isArray(payload.resources) ? payload.resources : [];
    resources.push(...batch);
    nextCursor = typeof payload.next_cursor === "string" ? payload.next_cursor : "";
  } while (nextCursor);

  return resources;
}

async function updateCloudinaryResourceContext({
  cloudName,
  apiKey,
  apiSecret,
  publicId,
  displayOrder,
  altText,
  year,
}) {
  const endpoint =
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${encodeURIComponent(publicId)}`;
  const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const body = new URLSearchParams({
    context:
      `display_order=${displayOrder}|` +
      `caption=${escapeCloudinaryContextValue(altText)}|` +
      `alt_text=${escapeCloudinaryContextValue(altText)}|` +
      `year=${escapeCloudinaryContextValue(year)}`,
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`Cloudinary context update failed for "${publicId}": ${responseBody}`);
  }
}

async function reorderCloudinaryPhotosByYear() {
  const root = process.cwd();
  loadEnvFile(path.join(root, ".env.local"));
  loadEnvFile(path.join(root, ".env"));

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const galleryTag = process.env.CLOUDINARY_GALLERY_TAG || "wedding-gallery";
  const tag = process.env.CLOUDINARY_REORDER_TAG || galleryTag;
  const apply = process.argv.includes("--apply");

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary config. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local or shell env.",
    );
  }

  console.log(
    `${apply ? "Applying" : "Dry run"} chronological reorder for tag: ${tag}`,
  );

  const resources = await listTaggedResources({ cloudName, apiKey, apiSecret, tag });
  const withYear = [];
  let missingYear = 0;

  for (const resource of resources) {
    const year = parseYear(resource);
    if (!year) {
      missingYear += 1;
      console.log(`- skip(no-year) ${resource.public_id}`);
      continue;
    }

    withYear.push({
      publicId: resource.public_id,
      year: Number(year),
      yearRaw: year,
      displayOrder: parseDisplayOrder(resource),
      altText: parseAltText(resource),
    });
  }

  withYear.sort((left, right) => {
    if (left.year !== right.year) {
      return left.year - right.year;
    }
    return left.publicId.localeCompare(right.publicId);
  });

  let unchanged = 0;
  let updated = 0;

  for (let index = 0; index < withYear.length; index += 1) {
    const photo = withYear[index];
    if (photo.displayOrder === index) {
      unchanged += 1;
      console.log(`- skip(existing-order) ${photo.publicId}: year=${photo.yearRaw}, order=${index}`);
      continue;
    }

    console.log(
      `- ${apply ? "update" : "would-update"} ${photo.publicId}: year=${photo.yearRaw}, order ${photo.displayOrder ?? "<empty>"} -> ${index}`,
    );

    if (apply) {
      await updateCloudinaryResourceContext({
        cloudName,
        apiKey,
        apiSecret,
        publicId: photo.publicId,
        displayOrder: String(index),
        altText: photo.altText,
        year: photo.yearRaw,
      });
      updated += 1;
    }
  }

  console.log("");
  console.log("Reorder summary");
  console.log(`- total: ${resources.length}`);
  console.log(`- with year: ${withYear.length}`);
  console.log(`- missing year: ${missingYear}`);
  console.log(`- unchanged: ${unchanged}`);
  console.log(`- ${apply ? "updated" : "updatable"}: ${apply ? updated : withYear.length - unchanged}`);
  if (!apply) {
    console.log("Run with --apply to write updates.");
  }
}

reorderCloudinaryPhotosByYear().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
