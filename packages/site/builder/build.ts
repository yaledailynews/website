import { clientEnv } from "./clientEnv";

const GIT_COMMIT_SHA = process.env["RAILWAY_GIT_COMMIT_SHA"];
if (!GIT_COMMIT_SHA) {
  throw new Error("Missing GIT_COMMIT_SHA");
}

console.log("Building for deployment ID:", GIT_COMMIT_SHA);

const client = await Bun.build({
  entrypoints: ["./src/client.tsx"],
  outdir: "./static",
  target: "browser",
  packages: "bundle",
  minify: true,
  naming: `[dir]/${GIT_COMMIT_SHA}/[name].[ext]`,
  experimentalCss: true,
  define: {
    "import.meta.env": JSON.stringify(clientEnv),
  },
});
console.log(client);
console.log("Running PostCSS...");

await Bun.$`bun run postcss ./static/${GIT_COMMIT_SHA}/client.css -o ./static/${GIT_COMMIT_SHA}/client.css`;

console.log("Done!");
