import type { CollectionAfterChangeHook } from 'payload'

import type { Post } from '@cms/payload-types'
import { purgeKeys } from '@cms/utilities/purgeKeys'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const keys: string[] = []

  // TODO: check for change in slug

  if (doc._status === 'published') {
    keys.push(`posts_${doc.slug}`)
    keys.push(`posts_id_${doc.id}`)

    if (doc.categories) {
      doc.categories.forEach((category) => {
        keys.push(`posts_category_${category}`)
      })
    }
    if (doc.authors) {
      doc.authors.forEach((author) => {
        keys.push(`posts_author_${author}`)
      })
    }
  }

  if (previousDoc._status === 'published') {
    keys.push(`posts_${previousDoc.slug}`)
    keys.push(`posts_id_${previousDoc.id}`)

    if (previousDoc.categories) {
      previousDoc.categories.forEach((category) => {
        keys.push(`posts_category_${category}`)
      })
    }
    if (previousDoc.authors) {
      previousDoc.authors.forEach((author) => {
        keys.push(`posts_author_${author}`)
      })
    }
  }

  await purgeKeys(keys)

  return doc
}
