// TODO: invalidation

import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateMedia } from './hooks/revalidateMedia'
import { generateBlur } from './hooks/generateBlurImage'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: false,
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'This will only be displayed if there is no author',
        placeholder: 'Courtesy of ...',
        condition(data, siblingData) {
          return !siblingData.author
        },
      },
    },
    {
      name: 'placeholder',
      type: 'text',
      admin: {
        hidden: true,
      }
    },
  ],
  hooks: {
    afterChange: [revalidateMedia],
    beforeChange: [generateBlur],
  },
}
