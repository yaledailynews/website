import type { Block } from 'payload'

export const Embed: Block = {
  slug: 'embed',
  interfaceName: 'EmbedBlock',
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'URL',
      required: true,
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Aspect Ratio',
      defaultValue: '16:9',
      options: [
        {
          label: '16:9',
          value: '16:9',
        },
        {
          label: '4:3',
          value: '4:3',
        },
        {
          label: '1:1',
          value: '1:1',
        },
        {
          label: '3:4',
          value: '3:4',
        },
        {
          label: '9:16',
          value: '9:16',
        },
      ],
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Caption',
    },
  ],
}
