import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import bunAdapter from "@hono/vite-dev-server/bun";
import path from "node:path";

const resolve = {
  alias: {
    // If you modify this, make sure to update the paths in tsconfig.json
    "@cms": path.resolve(__dirname, "../../packages/cms/src"),
    "@site": path.resolve(__dirname, "./src"),
    "@builder": path.resolve(__dirname, "./builder"),
  },
};

export default defineConfig({
  resolve,
  plugins: [
    devServer({
      entry: "src/server.tsx",
      adapter: bunAdapter,
    }),
  ],
});
