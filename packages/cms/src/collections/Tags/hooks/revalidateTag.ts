import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Tag } from '@cms/payload-types'

export const revalidateTagHook: CollectionAfterChangeHook<Tag> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  // const path = `/tags/${doc.slug}`

  // payload.logger.info(`Revalidating category at path: ${path}`)

  // revalidatePath(path)
  revalidateTag(`tags_${doc.slug}`)
  revalidateTag(`tags_id_${doc.id}`)

  // const prevPath = `/tags/${previousDoc.slug}`
  if (previousDoc.slug !== doc.slug) {
    // payload.logger.info(`Revalidating previous category path: ${prevPath}`)
    // revalidatePath(prevPath)
    revalidateTag(`tags_${previousDoc.slug}`)
    revalidateTag(`tags_id_${previousDoc.id}`)
  }

  return doc
}
