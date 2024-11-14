import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '@cms/payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = `/posts/${doc.slug}`

    payload.logger.info(`Revalidating post at path: ${path}`)

    revalidatePath(path)
    revalidateTag(`posts_${doc.slug}`)
    revalidateTag(`posts_id_${doc.id}`)

    if (doc.categories) {
      doc.categories.forEach((category) => {
        revalidateTag(`posts_category_${category}`)
      })
    }
    if (doc.authors) {
      doc.authors.forEach((author) => {
        revalidateTag(`posts_author_${author}`)
      })
    }
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/posts/${previousDoc.slug}`

    payload.logger.info(`Revalidating old post at path: ${oldPath}`)

    revalidatePath(oldPath)
    revalidateTag(`posts_${previousDoc.slug}`)
    revalidateTag(`posts_id_${previousDoc.id}`)

    if (previousDoc.categories) {
      previousDoc.categories.forEach((category) => {
        revalidateTag(`posts_category_${category}`)
      })
    }
    if (previousDoc.authors) {
      previousDoc.authors.forEach((author) => {
        revalidateTag(`posts_author_${author}`)
      })
    }
  }

  return doc
}
