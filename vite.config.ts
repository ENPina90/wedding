import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "cloudinary-photos-api",
      configureServer(server) {
        server.middlewares.use("/api/photos", async (req, res) => {
          const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
          const apiKey = process.env.CLOUDINARY_API_KEY;
          const apiSecret = process.env.CLOUDINARY_API_SECRET;
          const requestUrl = new URL(req.url ?? "", "http://localhost");
          const tag =
            requestUrl.searchParams.get("tag") ||
            process.env.CLOUDINARY_GALLERY_TAG ||
            "wedding-gallery";

          if (!cloudName || !apiKey || !apiSecret) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: "Cloudinary server configuration is missing.",
              }),
            );
            return;
          }

          try {
            const endpoint =
              `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${encodeURIComponent(tag)}` +
              "?max_results=100&direction=desc";
            const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString(
              "base64",
            );

            const response = await fetch(endpoint, {
              headers: {
                Authorization: `Basic ${authHeader}`,
              },
            });

            if (!response.ok) {
              const body = await response.text();
              res.statusCode = 502;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ error: `Cloudinary request failed: ${body}` }),
              );
              return;
            }

            const payload = (await response.json()) as {
              resources?: Array<{ asset_id: string; secure_url: string }>;
            };
            const resources = Array.isArray(payload.resources)
              ? payload.resources
              : [];

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                resources: resources.map((resource) => ({
                  asset_id: resource.asset_id,
                  secure_url: resource.secure_url,
                })),
              }),
            );
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Unknown error";
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: message }));
          }
        });
      },
    },
  ],
});
