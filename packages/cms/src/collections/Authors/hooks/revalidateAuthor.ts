import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Author } from '@cms/payload-types'

export const revalidateAuthor: CollectionAfterChangeHook<Author> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const path = `/authors/${doc.slug}`

  payload.logger.info(`Revalidating author at path: ${path}`)

  revalidatePath(path)
  revalidateTag(`authors_${doc.slug}`)
  revalidateTag(`authors_id_${doc.id}`)

  const prevPath = `/authors/${previousDoc.slug}`
  if (previousDoc.slug !== doc.slug) {
    payload.logger.info(`Revalidating previous author path: ${prevPath}`)
    revalidatePath(prevPath)
    revalidateTag(`authors_${previousDoc.slug}`)
    revalidateTag(`authors_id_${previousDoc.id}`)
  }

  return doc
}
