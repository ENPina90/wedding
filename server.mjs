import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const galleryTag = process.env.CLOUDINARY_GALLERY_TAG || "wedding-gallery";
  const pendingTag = process.env.CLOUDINARY_PENDING_TAG || `${galleryTag}-pending`;
  return { cloudName, apiKey, apiSecret, galleryTag, pendingTag };
};

const parseDisplayOrder = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
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

const toPhotoResource = (resource) => ({
  asset_id: resource.asset_id,
  public_id: resource.public_id,
  secure_url: resource.secure_url,
  display_order: parseDisplayOrder(resource.context?.custom?.display_order),
  alt_text: parseAltText(resource),
});

const sortByDisplayOrder = (resources) =>
  [...resources].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }
    return 0;
  });

const escapeCloudinaryContextValue = (value) =>
  value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/=/g, "\\=");

const listTaggedPhotos = async ({ cloudName, apiKey, apiSecret, tag }) => {
  const endpoint =
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${encodeURIComponent(tag)}` +
    "?max_results=100&direction=desc&context=true";
  const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Basic ${authHeader}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cloudinary request failed: ${body}`);
  }

  const payload = await response.json();
  const resources = Array.isArray(payload.resources) ? payload.resources : [];
  return resources.map(toPhotoResource);
};

const updateCloudinaryTag = async ({
  cloudName,
  apiKey,
  apiSecret,
  tag,
  command,
  publicId,
}) => {
  const endpoint =
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${encodeURIComponent(tag)}`;
  const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const body = new URLSearchParams();
  body.append("command", command);
  body.append("public_ids[]", publicId);

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
    throw new Error(`Cloudinary tag update failed: ${responseBody}`);
  }
};

const updateCloudinaryResourceContext = async ({
  cloudName,
  apiKey,
  apiSecret,
  publicId,
  displayOrder,
  altText,
}) => {
  const endpoint =
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${encodeURIComponent(publicId)}`;
  const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const body = new URLSearchParams({
    context:
      `display_order=${displayOrder}|` +
      `caption=${escapeCloudinaryContextValue(altText)}|` +
      `alt_text=${escapeCloudinaryContextValue(altText)}`,
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
    throw new Error(`Cloudinary context update failed: ${responseBody}`);
  }
};

const requireAdmin = (req, res) => {
  const adminKey = process.env.PHOTOS_ADMIN_KEY;
  const providedAdminKey = req.header("x-admin-key");

  if (!adminKey) {
    res.status(500).json({ error: "PHOTOS_ADMIN_KEY is missing." });
    return false;
  }

  if (!providedAdminKey || providedAdminKey !== adminKey) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  return true;
};

app.get("/api/photos", async (_req, res) => {
  const { cloudName, apiKey, apiSecret, galleryTag } = getCloudinaryConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Cloudinary server configuration is missing." });
    return;
  }

  try {
    const resources = await listTaggedPhotos({
      cloudName,
      apiKey,
      apiSecret,
      tag: galleryTag,
    });

    res.json({ resources: sortByDisplayOrder(resources) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(502).json({ error: message });
  }
});

app.get("/api/photos/pending", async (req, res) => {
  const { cloudName, apiKey, apiSecret, pendingTag } = getCloudinaryConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Cloudinary server configuration is missing." });
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  try {
    const resources = await listTaggedPhotos({
      cloudName,
      apiKey,
      apiSecret,
      tag: pendingTag,
    });

    res.json({ resources: sortByDisplayOrder(resources) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(502).json({ error: message });
  }
});

app.post("/api/photos/approve", async (req, res) => {
  const { cloudName, apiKey, apiSecret, galleryTag, pendingTag } =
    getCloudinaryConfig();
  const publicId =
    typeof req.body?.publicId === "string" ? req.body.publicId.trim() : "";

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Cloudinary server configuration is missing." });
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  if (!publicId) {
    res.status(400).json({ error: "Missing publicId." });
    return;
  }

  try {
    const approvedResources = await listTaggedPhotos({
      cloudName,
      apiKey,
      apiSecret,
      tag: galleryTag,
    });
    const pendingResources = await listTaggedPhotos({
      cloudName,
      apiKey,
      apiSecret,
      tag: pendingTag,
    });

    const pendingResource = pendingResources.find(
      (resource) => resource.public_id === publicId,
    );

    await updateCloudinaryTag({
      cloudName,
      apiKey,
      apiSecret,
      tag: galleryTag,
      command: "add",
      publicId,
    });

    await updateCloudinaryTag({
      cloudName,
      apiKey,
      apiSecret,
      tag: pendingTag,
      command: "remove",
      publicId,
    });

    await updateCloudinaryResourceContext({
      cloudName,
      apiKey,
      apiSecret,
      publicId,
      displayOrder: approvedResources.length,
      altText: pendingResource?.alt_text || "",
    });

    res.status(200).json({ result: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(502).json({ error: message });
  }
});

app.post("/api/photos/unapprove", async (req, res) => {
  const { cloudName, apiKey, apiSecret, galleryTag, pendingTag } =
    getCloudinaryConfig();
  const publicId =
    typeof req.body?.publicId === "string" ? req.body.publicId.trim() : "";

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Cloudinary server configuration is missing." });
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  if (!publicId) {
    res.status(400).json({ error: "Missing publicId." });
    return;
  }

  try {
    await updateCloudinaryTag({
      cloudName,
      apiKey,
      apiSecret,
      tag: galleryTag,
      command: "remove",
      publicId,
    });

    await updateCloudinaryTag({
      cloudName,
      apiKey,
      apiSecret,
      tag: pendingTag,
      command: "add",
      publicId,
    });

    res.status(200).json({ result: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(502).json({ error: message });
  }
});

app.post("/api/photos/caption", async (req, res) => {
  const { cloudName, apiKey, apiSecret, galleryTag } = getCloudinaryConfig();
  const publicId =
    typeof req.body?.publicId === "string" ? req.body.publicId.trim() : "";
  const altText = typeof req.body?.altText === "string" ? req.body.altText.trim() : "";

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Cloudinary server configuration is missing." });
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  if (!publicId) {
    res.status(400).json({ error: "Missing publicId." });
    return;
  }

  try {
    const approvedResources = await listTaggedPhotos({
      cloudName,
      apiKey,
      apiSecret,
      tag: galleryTag,
    });

    const target = approvedResources.find((resource) => resource.public_id === publicId);
    if (!target) {
      res.status(404).json({ error: "Photo not found in approved gallery." });
      return;
    }

    await updateCloudinaryResourceContext({
      cloudName,
      apiKey,
      apiSecret,
      publicId,
      displayOrder: target.display_order,
      altText,
    });

    res.status(200).json({ result: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(502).json({ error: message });
  }
});

app.post("/api/photos/reorder", async (req, res) => {
  const { cloudName, apiKey, apiSecret, galleryTag } = getCloudinaryConfig();
  const orderedPublicIds = Array.isArray(req.body?.orderedPublicIds)
    ? req.body.orderedPublicIds.filter((id) => typeof id === "string" && id.trim())
    : [];

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Cloudinary server configuration is missing." });
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  if (!orderedPublicIds.length) {
    res.status(400).json({ error: "Missing orderedPublicIds." });
    return;
  }

  try {
    const approvedResources = await listTaggedPhotos({
      cloudName,
      apiKey,
      apiSecret,
      tag: galleryTag,
    });
    const approvedById = new Map(
      approvedResources.map((resource) => [resource.public_id, resource]),
    );

    const validOrderedIds = orderedPublicIds.filter((publicId) =>
      approvedById.has(publicId),
    );

    await Promise.all(
      validOrderedIds.map((publicId, index) => {
        const existing = approvedById.get(publicId);
        return updateCloudinaryResourceContext({
          cloudName,
          apiKey,
          apiSecret,
          publicId,
          displayOrder: index,
          altText: existing?.alt_text || "",
        });
      }),
    );

    res.status(200).json({ result: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(502).json({ error: message });
  }
});

app.delete("/api/photos", async (req, res) => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const publicId =
    typeof req.body?.publicId === "string" ? req.body.publicId.trim() : "";

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Cloudinary server configuration is missing." });
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  if (!publicId) {
    res.status(400).json({ error: "Missing publicId." });
    return;
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signaturePayload = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(signaturePayload)
      .digest("hex");

    const body = new URLSearchParams({
      api_key: apiKey,
      invalidate: "true",
      public_id: publicId,
      signature,
      timestamp: String(timestamp),
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      },
    );

    if (!response.ok) {
      const responseBody = await response.text();
      res.status(502).json({ error: `Cloudinary delete failed: ${responseBody}` });
      return;
    }

    const payload = await response.json();
    if (payload.result !== "ok" && payload.result !== "not found") {
      res.status(502).json({
        error: `Cloudinary delete failed: ${JSON.stringify(payload)}`,
      });
      return;
    }

    res.status(200).json({ result: payload.result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

app.use(express.static(distDir));
app.get("/*path", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
