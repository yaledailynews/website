import { Block } from 'payload'

export const Newsletter: Block = {
  slug: 'layoutsNewsletter',
  interfaceName: 'NewsletterBlock',
  labels: {
    singular: 'Newsletter',
    plural: 'Newsletter',
  },
  fields: [
    {
      name: 'desktopPosition',
      label: 'Desktop Position',
      type: 'select',
      defaultValue: 'sidebar',
      options: [
        { label: 'Main', value: 'main' },
        { label: 'Sidebar', value: 'sidebar' },
        { label: 'Full Width at Top', value: 'fullTop' },
        { label: 'Full Width at Bottom', value: 'fullBottom' },
      ],
      admin: {
        readOnly: true,
      },
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
