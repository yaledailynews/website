import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '@cms/payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = `/${doc.slug}`

    payload.logger.info(`Revalidating page at path: ${path}`)

    revalidatePath(path)
    revalidateTag(`pages_${doc.slug}`)
    revalidateTag(`pages_id_${doc.id}`)
  }

  // If the page was previously published, we need to revalidate the old path
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = `/${previousDoc.slug}`

    payload.logger.info(`Revalidating old page at path: ${oldPath}`)

    revalidatePath(oldPath)
    revalidateTag(`pages_${doc.slug}`)
    revalidateTag(`pages_id_${doc.id}`)
  }

  return doc
}
