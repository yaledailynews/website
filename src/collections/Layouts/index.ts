import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CollectionConfig } from 'payload'
import { Text } from '@/blocks/Layout/Text/config'
import { Articles } from '@/blocks/Layout/Articles/config'
import { Podcasts } from '@/blocks/Layout/Podcasts/config'
import { Newsletter } from '@/blocks/Layout/Newsletter/config'

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
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'layouts',
        })

        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'layouts',
      })

      return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
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
        position: 'sidebar',
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
    // afterChange: [revalidatePage],
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
