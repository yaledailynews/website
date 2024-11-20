import type { CollectionAfterChangeHook } from "payload";
import type { Category } from "@cms/payload-types";
import { purgeKeys } from "@cms/utilities/purgeKeys";

export const revalidateCategory: CollectionAfterChangeHook<Category> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const keys = [`categories_${doc.slug}`, `categories_id_${doc.id}`];
  if (previousDoc.slug !== doc.slug) {
    keys.push(`categories_${previousDoc.slug}`);
    keys.push(`categories_id_${previousDoc.id}`);
  }

  await purgeKeys(keys);

  return doc;
};
