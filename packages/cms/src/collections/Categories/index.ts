// TODO: invalidation

import type { CollectionConfig } from 'payload'

import { anyone } from '@cms/access/anyone'
import { authenticated } from '@cms/access/authenticated'
import { slugField } from '@cms/fields/slug'
import { revalidateCategory } from './hooks/revalidateCategory'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'relationship',
      relationTo: 'layouts',
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidateCategory],
  },
}
