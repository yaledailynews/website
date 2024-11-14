const deploymentId = process.env["RAILWAY_DEPLOYMENT_ID"];

console.log("Building for deployment ID:", deploymentId);

const client = await Bun.build({
  entrypoints: ["./src/client.tsx"],
  outdir: "./static",
  target: "browser",
  packages: "bundle",
  minify: true,
  naming: `[dir]/${deploymentId}/[name].[ext]`,
  experimentalCss: true,
});
console.log(client);

console.log("Running PostCSS...");

await Bun.$`bun run postcss ./static/${deploymentId}/client.css -o ./static/${deploymentId}/client.css`;

console.log("Done!");
