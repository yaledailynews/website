import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Category } from '@cms/payload-types'

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const path = `/categories/${doc.slug}`

  payload.logger.info(`Revalidating category at path: ${path}`)

  revalidatePath(path)
  revalidateTag(`categories_${doc.slug}`)
  revalidateTag(`categories_id_${doc.id}`)

  const prevPath = `/categories/${previousDoc.slug}`
  if (previousDoc.slug !== doc.slug) {
    payload.logger.info(`Revalidating previous category path: ${prevPath}`)
    revalidatePath(prevPath)
    revalidateTag(`categories_${previousDoc.slug}`)
    revalidateTag(`categories_id_${previousDoc.id}`)
  }

  return doc
}
