// TODO: invalidation

import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateMedia } from './hooks/revalidateMedia'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  upload: {
    imageSizes: [
      {
        name: 'sm',
        width: 320,
      },
      {
        name: 'md',
        width: 640,
      },
      {
        name: 'lg',
        width: 1024,
      },
      {
        name: 'xl',
        width: 1280,
      },
    ],
    adminThumbnail: 'sm',
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
  ],
  hooks: {
    afterChange: [revalidateMedia],
    // beforeChange: [generateBlur],
  },
}
