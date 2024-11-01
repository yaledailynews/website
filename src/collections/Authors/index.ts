import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { Banner } from '@/blocks/Banner'
import { Code } from '@/blocks/Code'
import { MediaBlock } from '@/blocks/MediaBlock'
import { SERVER_URL } from '@/env'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload'
import { revalidateAuthor } from './hooks/revalidateAuthor'

export const Authors: CollectionConfig = {
  slug: 'authors',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
        })

        return `${SERVER_URL}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'posts',
      })

      return `${SERVER_URL}${path}`
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email Address',
    },
    {
      name: 'bio',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      required: false,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Avatar',
    },
    {
      name: 'showPosts',
      type: 'checkbox',
      label: 'Show Posts',
      defaultValue: true,
    },
    {
      name: 'showMedia',
      type: 'checkbox',
      label: 'Show Media',
      defaultValue: false,
    },
    {
      name: 'twitter',
      type: 'text',
      label: 'Twitter (X) Handle',
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Instagram Handle',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField('name'),
  ],
  hooks: {
    afterChange: [revalidateAuthor],
  },
}
