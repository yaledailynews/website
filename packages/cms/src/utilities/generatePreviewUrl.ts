import { z } from "zod";
import crypto from "node:crypto";

const env = z
  .object({
    SITE_URL: z.string().url(),
    DRAFT_SECRET: z.string().min(1),
  })
  .parse(process.env);

export const generatePreviewUrl = (collection: string, id: number) => {
  const time = Date.now();
  const hash = crypto
    .createHmac("sha256", env.DRAFT_SECRET)
    .update(`${collection}${id}${time}`)
    .digest("hex");

  const urlSearchParams = new URLSearchParams({
    collection,
    id: id.toString(),
    time: time.toString(),
    hash,
  });

  return `${env.SITE_URL}/preview?${urlSearchParams.toString()}`;
};
