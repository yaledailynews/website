import type { CollectionAfterChangeHook } from 'payload'
import type { Layout } from '@cms/payload-types'

export const revalidateLayout: CollectionAfterChangeHook<Layout> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const keys: string[] = []
  if (doc._status === 'published') {
    keys.push(`layouts_${doc.slug}`)
    keys.push(`layouts_id_${doc.id}`)
  }

  // If the layout was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published') {
    keys.push(`layouts_${previousDoc.slug}`)
    keys.push(`layouts_id_${previousDoc.id}`)
  }

  return doc
}
