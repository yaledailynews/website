import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CollectionConfig } from 'payload'
import { Text } from '@/collections/Layouts/blocks/Text'
import { Articles } from '@/collections/Layouts/blocks/Articles'
import { Podcasts } from '@/collections/Layouts/blocks/Podcasts'
import { Newsletter } from '@/collections/Layouts/blocks/Newsletter'
import { SERVER_URL } from '@/env'
import { revalidateLayout } from './hooks/revalidateLayout'

export const Layouts: CollectionConfig = {
  slug: 'layouts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'publishedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          id: data.id as number,
          collection: 'layouts',
        })

        return `${SERVER_URL}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        id: data.id as number,
        collection: 'layouts',
      })

      return `${SERVER_URL}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    ...slugField(),
    {
      name: 'template',
      type: 'select',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Category', value: 'category' },
        { label: 'Special Issue', value: 'special-issue' },
        { label: 'Magazine', value: 'magazine' },
        { label: 'Podcast', value: 'podcast' },
      ],
      defaultValue: 'standard',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [Articles, Text, Podcasts, Newsletter],
    },
  ],
  hooks: {
    afterChange: [revalidateLayout],
    // beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
