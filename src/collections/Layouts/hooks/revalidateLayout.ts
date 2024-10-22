import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Layout } from '@payload-types'

export const revalidateLayout: CollectionAfterChangeHook<Layout> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = `/layouts/${doc.slug}`

    payload.logger.info(`Revalidating layout at path: ${path}`)

    revalidatePath(path)
    revalidateTag(`layouts_${doc.slug}`)
    revalidateTag(`layouts_id_${doc.id}`)
  }

  // If the layout was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/layouts/${previousDoc.slug}`

    payload.logger.info(`Revalidating old layout at path: ${oldPath}`)

    revalidatePath(oldPath)
    revalidateTag(`layouts_${previousDoc.slug}`)
    revalidateTag(`layouts_id_${previousDoc.id}`)
  }

  return doc
}
