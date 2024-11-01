// TODO: invalidation

import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'
import { revalidateCategory } from './hooks/revalidateCategory'
import { addToPinecone } from '@/hooks/addToPinecone'

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
    afterChange: [revalidateCategory, addToPinecone],
  },
}
