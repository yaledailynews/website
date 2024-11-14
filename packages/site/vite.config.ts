import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import bunAdapter from "@hono/vite-dev-server/bun";
import path from "node:path";

const resolve = {
  alias: {
    "@cms": path.resolve(__dirname, "../../packages/cms/src"),
    "@site": path.resolve(__dirname, "./src"),
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
