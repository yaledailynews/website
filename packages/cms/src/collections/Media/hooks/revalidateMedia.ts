import type { CollectionAfterChangeHook } from "payload";

import type { Media } from "@cms/payload-types";
import { purgeKeys } from "@cms/utilities/purgeKeys";

export const revalidateMedia: CollectionAfterChangeHook<Media> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const keys = [`media_id_${doc.id}`];
  if (doc.author) {
    keys.push(`media_author_${doc.author}`);
  }

  if (previousDoc) {
    keys.push(`media_id_${previousDoc.id}`);
    if (previousDoc.author) {
      keys.push(`media_author_${previousDoc.author}`);
    }
  }

  await purgeKeys(keys);

  return doc;
};
