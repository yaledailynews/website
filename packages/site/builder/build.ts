import { clientEnv } from "./clientEnv";
import esbuild from "esbuild";
import postcss from "esbuild-postcss";

const GIT_COMMIT_SHA = process.env["RAILWAY_GIT_COMMIT_SHA"];
if (!GIT_COMMIT_SHA) {
  throw new Error("Missing GIT_COMMIT_SHA");
}

// TODO: purge everything cloudflare on rebuild

console.log("Building for deployment ID:", GIT_COMMIT_SHA);

await esbuild.build({
  entryPoints: ["./src/client.tsx"],
  outdir: `./static/${GIT_COMMIT_SHA}`,
  target: ["esnext"],
  bundle: true,
  minify: true,
  loader: {
    ".css": "css",
  },
  define: {
    "import.meta.env": JSON.stringify(clientEnv),
  },
  plugins: [postcss()],
  logLevel: "info",
});
