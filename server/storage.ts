// Preconfigured storage helpers for Manus WebDev templates
// Uploads via Forge Server presigned URL to S3 (PUT direct).
// Downloads return /manus-storage/{key} paths served via 307 redirect.

import { ENV } from "./_core/env";
import * as fs from "fs/promises";
import * as path from "path";
import { v2 as cloudinary } from "cloudinary";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

const cloudinaryConfig = getCloudinaryConfig();
if (cloudinaryConfig) {
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
    secure: true,
  });
}

function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;

  if (!forgeUrl || !forgeKey) {
    return null;
  }

  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const cConfig = getCloudinaryConfig();
  if (cConfig) {
    let base64: string;
    if (Buffer.isBuffer(data)) {
      base64 = data.toString("base64");
    } else if (typeof data === "string") {
      base64 = Buffer.from(data).toString("base64");
    } else {
      base64 = Buffer.from(data as Uint8Array).toString("base64");
    }
    const dataUri = `data:${contentType};base64,${base64}`;
    
    const key = appendHashSuffix(normalizeKey(relKey));
    const ext = path.extname(key);
    const publicId = path.basename(key, ext);
    const folder = path.dirname(key) !== "." ? path.dirname(key) : "portfolio";

    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        public_id: publicId,
        folder: folder,
        resource_type: "auto",
      });
      return { key: result.public_id, url: result.secure_url };
    } catch (error) {
      console.error("[Storage] Cloudinary upload failed, falling back to local:", error);
    }
  }

  const config = getForgeConfig();
  const key = appendHashSuffix(normalizeKey(relKey));

  if (!config) {
    // Local fallback mode: save directly to client/public/manus-storage/
    const targetDir = path.resolve(process.cwd(), "client", "public", "manus-storage");
    const targetPath = path.join(targetDir, key);

    // Ensure the parent directory exists
    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    // Write file content
    await fs.writeFile(targetPath, data);

    // Also write to dist/public/manus-storage if it exists (for immediate access in production build)
    const distDir = path.resolve(process.cwd(), "dist", "public", "manus-storage");
    const distPath = path.join(distDir, key);
    try {
      await fs.mkdir(path.dirname(distPath), { recursive: true });
      await fs.writeFile(distPath, data);
    } catch {
      // Ignore if dist/public doesn't exist yet
    }

    return { key, url: `/manus-storage/${key}` };
  }

  const { forgeUrl, forgeKey } = config;

  // 1. Get presigned PUT URL from Forge
  const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
  presignUrl.searchParams.set("path", key);

  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` },
  });

  if (!presignResp.ok) {
    const msg = await presignResp.text().catch(() => presignResp.statusText);
    throw new Error(`Storage presign failed (${presignResp.status}): ${msg}`);
  }

  const { url: s3Url } = (await presignResp.json()) as { url: string };
  if (!s3Url) throw new Error("Forge returned empty presign URL");

  // 2. PUT file directly to S3
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });

  const uploadResp = await fetch(s3Url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!uploadResp.ok) {
    throw new Error(`Storage upload to S3 failed (${uploadResp.status})`);
  }

  return { key, url: `/manus-storage/${key}` };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: `/manus-storage/${key}` };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const config = getForgeConfig();
  const key = normalizeKey(relKey);

  if (!config) {
    // Local fallback mode: return direct path
    return `/manus-storage/${key}`;
  }

  const { forgeUrl, forgeKey } = config;

  const getUrl = new URL("v1/storage/presign/get", forgeUrl + "/");
  getUrl.searchParams.set("path", key);

  const resp = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` },
  });

  if (!resp.ok) {
    const msg = await resp.text().catch(() => resp.statusText);
    throw new Error(`Storage signed URL failed (${resp.status}): ${msg}`);
  }

  const { url } = (await resp.json()) as { url: string };
  return url;
}

