// TODO: compression

import fs from "node:fs/promises";
import type { Hono } from "hono";

export async function staticFileHandler(app: Hono) {
  if (import.meta.env["PROD"]) {
    const publicDir = "./public";

    for (const filePath of await fs.readdir(publicDir, {
      recursive: true,
    })) {
      // TODO: on build call cloudflare to clear these routes on cache
      app.get(`/${filePath}`, (c) => {
        const file = Bun.file(`${publicDir}/${filePath}`);
        return c.body(file.stream(), 200, {
          "Content-Type": file.type,
          "CDN-Cache-Control": "public, max-age=31536000, immutable",
          "Cache-Control": "public, max-age=3600",
        });
      });
    }

    const staticDir = "./static";
    for (const filePath of await fs.readdir(staticDir, {
      recursive: true,
    })) {
      app.get(`/static/${filePath}`, (c) => {
        const file = Bun.file(`${staticDir}/${filePath}`);
        return c.body(file.stream(), 200, {
          "Content-Type": file.type,
          "Cache-Control": "public, max-age=31536000, immutable",
        });
      });
    }
  }
}
