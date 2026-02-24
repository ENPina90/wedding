import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import crypto from "node:crypto";
import type { IncomingMessage } from "node:http";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

const readJsonBody = async (req: IncomingMessage): Promise<unknown> =>
  await new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const galleryTag = process.env.CLOUDINARY_GALLERY_TAG || "wedding-gallery";
  const pendingTag = process.env.CLOUDINARY_PENDING_TAG || `${galleryTag}-pending`;
  return { cloudName, apiKey, apiSecret, galleryTag, pendingTag };
};

const parseDisplayOrder = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
};

const parseAltText = (resource: {
  context?: { custom?: { alt_text?: string; caption?: string } };
}) => {
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

const toPhotoResource = (resource: {
  asset_id: string;
  public_id: string;
  secure_url: string;
  context?: { custom?: { display_order?: string; alt_text?: string; caption?: string } };
}) => ({
  asset_id: resource.asset_id,
  public_id: resource.public_id,
  secure_url: resource.secure_url,
  display_order: parseDisplayOrder(resource.context?.custom?.display_order),
  alt_text: parseAltText(resource),
});

const listTaggedPhotos = async ({
  cloudName,
  apiKey,
  apiSecret,
  tag,
}: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  tag: string;
}) => {
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

  const payload = (await response.json()) as {
    resources?: Array<{
      asset_id: string;
      public_id: string;
      secure_url: string;
      context?: {
        custom?: {
          display_order?: string;
          alt_text?: string;
          caption?: string;
        };
      };
    }>;
  };
  const resources = Array.isArray(payload.resources) ? payload.resources : [];

  return resources.map(toPhotoResource);
};

const sortByDisplayOrder = (
  resources: Array<{
    asset_id: string;
    public_id: string;
    secure_url: string;
    display_order: number;
    alt_text: string;
  }>,
) =>
  [...resources].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }
    return 0;
  });

const escapeCloudinaryContextValue = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/=/g, "\\=");

const updateCloudinaryTag = async ({
  cloudName,
  apiKey,
  apiSecret,
  tag,
  command,
  publicId,
}: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  tag: string;
  command: "add" | "remove";
  publicId: string;
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
}: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  publicId: string;
  displayOrder: number;
  altText: string;
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

const requireAdmin = (
  req: IncomingMessage,
  res: {
    statusCode: number;
    setHeader: (name: string, value: string) => void;
    end: (data: string) => void;
  },
) => {
  const adminKey = process.env.PHOTOS_ADMIN_KEY;
  const providedAdminKey = req.headers["x-admin-key"];

  if (!adminKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "PHOTOS_ADMIN_KEY is missing." }));
    return false;
  }

  if (!providedAdminKey || providedAdminKey !== adminKey) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return false;
  }

  return true;
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "cloudinary-photos-api",
      configureServer(server) {
        server.middlewares.use("/api/photos", async (req, res) => {
          const method = (req.method ?? "GET").toUpperCase();
          const { cloudName, apiKey, apiSecret, galleryTag, pendingTag } =
            getCloudinaryConfig();
          const requestUrl = new URL(req.url ?? "", "http://localhost");
          const pathname = requestUrl.pathname;

          if (!cloudName || !apiKey || !apiSecret) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ error: "Cloudinary server configuration is missing." }),
            );
            return;
          }

          try {
            if (method === "GET" && pathname === "/") {
              const resources = await listTaggedPhotos({
                cloudName,
                apiKey,
                apiSecret,
                tag: galleryTag,
              });

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ resources: sortByDisplayOrder(resources) }));
              return;
            }

            if (method === "GET" && pathname === "/pending") {
              if (!requireAdmin(req, res)) {
                return;
              }

              const resources = await listTaggedPhotos({
                cloudName,
                apiKey,
                apiSecret,
                tag: pendingTag,
              });

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ resources: sortByDisplayOrder(resources) }));
              return;
            }

            if (method === "POST" && pathname === "/approve") {
              if (!requireAdmin(req, res)) {
                return;
              }

              const requestBody = (await readJsonBody(req)) as { publicId?: string };
              const publicId = requestBody.publicId?.trim() ?? "";

              if (!publicId) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing publicId." }));
                return;
              }

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

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ result: "ok" }));
              return;
            }

            if (method === "POST" && pathname === "/unapprove") {
              if (!requireAdmin(req, res)) {
                return;
              }

              const requestBody = (await readJsonBody(req)) as { publicId?: string };
              const publicId = requestBody.publicId?.trim() ?? "";

              if (!publicId) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing publicId." }));
                return;
              }

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

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ result: "ok" }));
              return;
            }

            if (method === "POST" && pathname === "/caption") {
              if (!requireAdmin(req, res)) {
                return;
              }

              const requestBody = (await readJsonBody(req)) as {
                publicId?: string;
                altText?: string;
              };
              const publicId = requestBody.publicId?.trim() ?? "";
              const altText = requestBody.altText?.trim() ?? "";

              if (!publicId) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing publicId." }));
                return;
              }

              const approvedResources = await listTaggedPhotos({
                cloudName,
                apiKey,
                apiSecret,
                tag: galleryTag,
              });
              const target = approvedResources.find(
                (resource) => resource.public_id === publicId,
              );

              if (!target) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Photo not found in approved gallery." }));
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

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ result: "ok" }));
              return;
            }

            if (method === "POST" && pathname === "/reorder") {
              if (!requireAdmin(req, res)) {
                return;
              }

              const requestBody = (await readJsonBody(req)) as {
                orderedPublicIds?: unknown[];
              };
              const orderedPublicIds = Array.isArray(requestBody.orderedPublicIds)
                ? requestBody.orderedPublicIds.filter(
                    (id): id is string => typeof id === "string" && id.trim().length > 0,
                  )
                : [];

              if (!orderedPublicIds.length) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing orderedPublicIds." }));
                return;
              }

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

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ result: "ok" }));
              return;
            }

            if (method === "DELETE" && pathname === "/") {
              if (!requireAdmin(req, res)) {
                return;
              }

              const requestBody = (await readJsonBody(req)) as { publicId?: string };
              const publicId = requestBody.publicId?.trim() ?? "";

              if (!publicId) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing publicId." }));
                return;
              }

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
                res.statusCode = 502;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({ error: `Cloudinary delete failed: ${responseBody}` }),
                );
                return;
              }

              const payload = (await response.json()) as { result?: string };
              if (payload.result !== "ok" && payload.result !== "not found") {
                res.statusCode = 502;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: `Cloudinary delete failed: ${JSON.stringify(payload)}`,
                  }),
                );
                return;
              }

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ result: payload.result }));
              return;
            }

            res.statusCode = 405;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Method Not Allowed" }));
          } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: message }));
          }
        });
      },
    },
  ],
});
