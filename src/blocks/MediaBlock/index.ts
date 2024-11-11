import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  fields: [
    {
      name: 'position',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Inline',
          value: 'default',
        },
        {
          label: 'Wide',
          value: 'wide',
        },
        {
          label: 'Full Width',
          value: 'fullscreen',
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      required: false,
    },
  ],
}
