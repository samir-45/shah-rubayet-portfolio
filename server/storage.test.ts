import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { storagePut, storageGetSignedUrl } from "./storage";
import { ENV } from "./_core/env";
import * as fs from "fs/promises";
import * as path from "path";

describe("Storage Fallback", () => {
  const originalApiUrl = ENV.forgeApiUrl;
  const originalApiKey = ENV.forgeApiKey;

  beforeEach(() => {
    // Force local fallback by default
    ENV.forgeApiUrl = "";
    ENV.forgeApiKey = "";
  });

  afterEach(async () => {
    // Restore
    ENV.forgeApiUrl = originalApiUrl;
    ENV.forgeApiKey = originalApiKey;

    // Clean up test files inside client/public/manus-storage
    try {
      const targetDir = path.resolve(process.cwd(), "client", "public", "manus-storage");
      const files = await fs.readdir(targetDir);
      for (const file of files) {
        if (file.startsWith("test_upload_")) {
          await fs.unlink(path.join(targetDir, file));
        }
      }
    } catch {
      // Ignore cleanup error if directory/files don't exist
    }
  });

  it("successfully writes files locally and returns local url when forge config is missing", async () => {
    const fileContent = "hello local storage fallback";
    const fileName = "test_upload_file.txt";
    const result = await storagePut(fileName, fileContent, "text/plain");

    expect(result.key).toContain("test_upload_file");
    expect(result.url).toBe(`/manus-storage/${result.key}`);

    const targetDir = path.resolve(process.cwd(), "client", "public", "manus-storage");
    const writtenContent = await fs.readFile(path.join(targetDir, result.key), "utf-8");
    expect(writtenContent).toBe(fileContent);
  });

  it("returns correct direct path from storageGetSignedUrl when forge config is missing", async () => {
    const url = await storageGetSignedUrl("test_upload_file.txt");
    expect(url).toBe("/manus-storage/test_upload_file.txt");
  });
});
