import { clientEnv } from "./clientEnv";

const DEPLOYMENT_ID = import.meta.env["DEPLOYMENT_ID"];
if (!DEPLOYMENT_ID) {
  throw new Error("Missing DEPLOYMENT_ID");
}

console.log("Building for deployment ID:", DEPLOYMENT_ID);

const client = await Bun.build({
  entrypoints: ["./src/client.tsx"],
  outdir: "./static",
  target: "browser",
  packages: "bundle",
  minify: true,
  naming: `[dir]/${DEPLOYMENT_ID}/[name].[ext]`,
  experimentalCss: true,
  define: {
    "import.meta.env": JSON.stringify(clientEnv),
  },
});
console.log(client);
console.log("Running PostCSS...");

await Bun.$`pwd`;

await Bun.$`bun run postcss ./static/${DEPLOYMENT_ID}/client.css -o ./static/${DEPLOYMENT_ID}/client.css`;

console.log("Done!");
