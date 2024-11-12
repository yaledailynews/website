import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

import type { Media } from '@payload-types'

export const revalidateMedia: CollectionAfterChangeHook<Media> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  revalidateTag(`media_id_${doc.id}`)
  if (doc.author) {
    revalidateTag(`media_author_${doc.author}`)
  }

  if (previousDoc) {
    revalidateTag(`media_id_${previousDoc.id}`)
    if (previousDoc.author) {
      revalidateTag(`media_author_${previousDoc.author}`)
    }
  }

  return doc
}
