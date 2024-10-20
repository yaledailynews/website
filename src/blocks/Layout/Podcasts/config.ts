import { Block } from 'payload'

export const Podcasts: Block = {
  slug: 'layoutsPodcasts',
  interfaceName: 'PodcastsBlock',
  labels: {
    singular: 'Podcasts',
    plural: 'Podcasts',
  },
  fields: [
    // {
    //   name: "podcasts",
    //   type: "relationship",
    //   relationTo: "podcasts",
    //   required: true,
    //   hasMany: true,
    //   minRows: 1,
    //   admin: {
    //     isSortable: true,
    //   },
    // },
    {
      name: 'desktopPosition',
      label: 'Desktop Position',
      type: 'select',
      defaultValue: 'sidebar',
      options: [
        { label: 'Default', value: 'default' },
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
