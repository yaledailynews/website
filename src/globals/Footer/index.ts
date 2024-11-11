import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      label: 'Description',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature()]
        },
      }),
    },
    {
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      required: true,
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
    link({
      appearances: false,
      overrides: {
        name: 'primaryButton',
      },
    }),
    link({
      appearances: false,
      overrides: {
        name: 'secondaryButton',
      },
    }),
    {
      name: 'contacts',
      label: 'Contacts',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          label: 'Email',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
