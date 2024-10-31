import { Post } from '@payload-types'
import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc, payload }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, title, subhead } = originalDoc as Post

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    meta: {
      title: title,
      subhead: subhead,
    },
  }

  return modifiedDoc
}
