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

const parseTags = (galleryTag, pendingTag) => {
  const configured = process.env.CLOUDINARY_BACKFILL_TAGS;
  if (configured) {
    return configured
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [galleryTag, pendingTag];
};

const normalizeDisplayOrder = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? String(parsed) : "";
};

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

async function backfillCloudinaryYears() {
  const root = process.cwd();
  loadEnvFile(path.join(root, ".env.local"));
  loadEnvFile(path.join(root, ".env"));

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const galleryTag = process.env.CLOUDINARY_GALLERY_TAG || "wedding-gallery";
  const pendingTag = process.env.CLOUDINARY_PENDING_TAG || `${galleryTag}-pending`;
  const tags = parseTags(galleryTag, pendingTag);
  const apply = process.argv.includes("--apply");

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary config. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local or shell env.",
    );
  }

  if (!tags.length) {
    throw new Error("No tags selected. Set CLOUDINARY_BACKFILL_TAGS or use gallery/pending defaults.");
  }

  console.log(
    `${apply ? "Applying" : "Dry run"} year backfill for tags: ${tags.join(", ")}`,
  );

  const resourceByPublicId = new Map();
  for (const tag of tags) {
    const resources = await listTaggedResources({ cloudName, apiKey, apiSecret, tag });
    for (const resource of resources) {
      if (!resourceByPublicId.has(resource.public_id)) {
        resourceByPublicId.set(resource.public_id, resource);
      }
    }
  }

  let matched = 0;
  let missingYear = 0;
  let alreadySet = 0;
  let updated = 0;

  for (const resource of resourceByPublicId.values()) {
    const altText = parseAltText(resource);
    const parsedYear = parseYearFromText(altText);
    const existingYearRaw = resource.context?.custom?.year;
    const existingYear =
      typeof existingYearRaw === "string" ? existingYearRaw.trim() : "";
    const displayOrder = normalizeDisplayOrder(resource.context?.custom?.display_order);

    if (!parsedYear) {
      missingYear += 1;
      console.log(
        `- skip(no-year) ${resource.public_id}: "${altText || "<empty>"}"`,
      );
      continue;
    }

    matched += 1;
    if (existingYear === parsedYear) {
      alreadySet += 1;
      console.log(`- skip(existing) ${resource.public_id}: year=${parsedYear}`);
      continue;
    }

    console.log(`- ${apply ? "update" : "would-update"} ${resource.public_id}: ${existingYear || "<empty>"} -> ${parsedYear}`);

    if (apply) {
      await updateCloudinaryResourceContext({
        cloudName,
        apiKey,
        apiSecret,
        publicId: resource.public_id,
        displayOrder,
        altText,
        year: parsedYear,
      });
      updated += 1;
    }
  }

  console.log("");
  console.log("Backfill summary");
  console.log(`- total: ${resourceByPublicId.size}`);
  console.log(`- parsed year: ${matched}`);
  console.log(`- missing year: ${missingYear}`);
  console.log(`- already set: ${alreadySet}`);
  console.log(`- ${apply ? "updated" : "updatable"}: ${apply ? updated : matched - alreadySet}`);
  if (!apply) {
    console.log("Run with --apply to write updates.");
  }
}

backfillCloudinaryYears().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
