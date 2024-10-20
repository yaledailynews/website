import { Block } from 'payload'

export const Text: Block = {
  slug: 'layoutsText',
  interfaceName: 'TextBlock',
  labels: {
    singular: 'Text',
    plural: 'Text',
  },
  fields: [
    {
      name: 'text',
      type: 'richText',
      required: true,
    },
    {
      name: 'desktopPosition',
      label: 'Desktop Position',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Full Width at Top', value: 'fullTop' },
        { label: 'Full Width at Bottom', value: 'fullBottom' },
      ],
    },
    {
      name: 'topDivider',
      label: 'Top Divider',
      type: 'select',
      options: [
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
      ],
      defaultValue: 'dark',
      required: true,
    },
  ],
}
