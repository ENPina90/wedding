import { createHash } from "node:crypto";
import { openAsBlob, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
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

function cloudinarySignature(params, apiSecret) {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
}

async function uploadLocalPhotos() {
  const root = process.cwd();
  loadEnvFile(path.join(root, ".env.local"));
  loadEnvFile(path.join(root, ".env"));

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const tag = process.env.CLOUDINARY_GALLERY_TAG || "wedding-gallery";
  const folder = process.env.CLOUDINARY_GALLERY_FOLDER || "wedding-gallery";
  const sourceDir =
    process.env.CLOUDINARY_SOURCE_DIR || path.join("src", "assets", "photos");

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary config. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local or shell env.",
    );
  }

  const absoluteSourceDir = path.join(root, sourceDir);
  const allFiles = await readdir(absoluteSourceDir);
  const imageFiles = allFiles.filter((fileName) =>
    /\.(jpe?g|png|webp|heic)$/i.test(fileName),
  );

  if (imageFiles.length === 0) {
    console.log(`No images found in ${sourceDir}`);
    return;
  }

  console.log(`Uploading ${imageFiles.length} files from ${sourceDir}...`);

  for (const fileName of imageFiles) {
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = path.parse(fileName).name;
    const filePath = path.join(absoluteSourceDir, fileName);
    const fileBlob = await openAsBlob(filePath);
    const signingParams = {
      folder,
      public_id: publicId,
      tags: tag,
      timestamp,
    };
    const signature = cloudinarySignature(signingParams, apiSecret);

    const formData = new FormData();
    formData.append("file", fileBlob, fileName);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("folder", folder);
    formData.append("public_id", publicId);
    formData.append("tags", tag);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Upload failed for ${fileName}: ${body}`);
    }

    const result = await response.json();
    console.log(`Uploaded ${fileName} -> ${result.secure_url}`);
  }
}

uploadLocalPhotos().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
