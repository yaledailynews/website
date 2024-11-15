import type { CollectionAfterChangeHook } from 'payload'
import type { Author } from '@cms/payload-types'
import { purgeKeys } from '@cms/utilities/purgeKeys'

export const revalidateAuthor: CollectionAfterChangeHook<Author> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const keys = [`authors_${doc.slug}`, `authors_id_${doc.id}`]
  if (previousDoc.slug !== doc.slug) {
    keys.push(`authors_${previousDoc.slug}`)
    keys.push(`authors_id_${previousDoc.id}`)
  }

  await purgeKeys(keys)

  return doc
}
