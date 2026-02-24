import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");

app.get("/api/photos", async (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const requestedTag = req.query.tag;
  const tag =
    (typeof requestedTag === "string" && requestedTag.trim()) ||
    process.env.CLOUDINARY_GALLERY_TAG ||
    "wedding-gallery";

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({ error: "Cloudinary server configuration is missing." });
    return;
  }

  try {
    const endpoint =
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${encodeURIComponent(tag)}` +
      "?max_results=100&direction=desc";
    const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      res.status(502).json({ error: `Cloudinary request failed: ${body}` });
      return;
    }

    const payload = await response.json();
    const resources = Array.isArray(payload.resources) ? payload.resources : [];

    res.json({
      resources: resources.map((resource) => ({
        asset_id: resource.asset_id,
        secure_url: resource.secure_url,
      })),
    });
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
