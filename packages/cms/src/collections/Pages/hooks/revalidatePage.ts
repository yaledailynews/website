import type { CollectionAfterChangeHook } from 'payload'

import type { Page } from '@cms/payload-types'
import { purgeKeys } from '@cms/utilities/purgeKeys'

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const keys: string[] = []
  if (doc._status === 'published') {
    keys.push(`pages_${doc.slug}`)
    keys.push(`pages_id_${doc.id}`)
  }

  // If the page was previously published, we need to revalidate the old path
  if (previousDoc?._status === 'published') {
    keys.push(`pages_${previousDoc.slug}`)
    keys.push(`pages_id_${previousDoc.id}`)
  }

  await purgeKeys(keys)

  return doc
}
