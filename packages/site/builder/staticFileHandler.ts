import fs from "node:fs/promises";
import type { Hono } from "hono";

export async function staticFileHandler(app: Hono) {
  if (import.meta.env["PROD"]) {
    const publicDir = "./public";

    for (const filePath of await fs.readdir(publicDir, {
      recursive: true,
    })) {
      app.get(`/${filePath}`, (c) => {
        const file = Bun.file(`${publicDir}/${filePath}`);
        return c.body(file.stream());
      });
    }

    const staticDir = "./static";
    for (const filePath of await fs.readdir(staticDir, {
      recursive: true,
    })) {
      app.get(`/static/${filePath}`, (c) => {
        const file = Bun.file(`${staticDir}/${filePath}`);
        return c.body(file.stream());
      });
    }
  }
}
