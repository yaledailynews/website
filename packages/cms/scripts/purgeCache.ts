import { z } from "zod";

const env = z
  .object({
    CLOUDFLARE_ZONE_ID: z.string().min(1),
    CLOUDFLARE_API_KEY: z.string().min(1),
    SITE_HOST: z.string().min(1),
  })
  .parse(process.env);

console.log("Purging Cloudflare cache");

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.CLOUDFLARE_API_KEY}`,
  },
  body: JSON.stringify({ purge_everything: true }),
};
const res = await fetch(
  `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`,
  options,
);
const data = await res.json();
console.log(data);
if (data.success) {
  console.log("Successfully purged cache");
} else {
  throw new Error("Failed to purge Cloudflare cache");
}
