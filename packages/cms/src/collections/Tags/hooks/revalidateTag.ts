import type { CollectionAfterChangeHook } from "payload";

import type { Tag } from "@cms/payload-types";
import { purgeKeys } from "@cms/utilities/purgeKeys";

export const revalidateTagHook: CollectionAfterChangeHook<Tag> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const keys = [`tags_${doc.slug}`, `tags_id_${doc.id}`];
  if (previousDoc.slug !== doc.slug) {
    keys.push(`tags_${previousDoc.slug}`, `tags_id_${previousDoc.id}`);
  }
  await purgeKeys(keys);

  return doc;
};
