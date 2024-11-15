import { anyone } from '@cms/access/anyone'
import { authenticated } from '@cms/access/authenticated'
import { Banner } from '@cms/blocks/Banner'
import { MediaBlock } from '@cms/blocks/Media'
import { slugField } from '@cms/fields/slug'
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
import { Embed } from '@cms/blocks/Embed'

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
            BlocksFeature({ blocks: [Banner, Embed, MediaBlock] }),
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
