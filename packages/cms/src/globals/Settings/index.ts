import type { GlobalConfig } from 'payload'

// import { link } from '@cms/fields/link'
import { revalidateSettings } from './hooks/revalidateSettings'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
  },
  fields: [
    // {
    //   name: 'logo',
    //   type: 'upload',
    //   relationTo: 'media',
    //   required: true,
    // },
    {
      name: 'homeLayout',
      type: 'relationship',
      relationTo: 'layouts',
      required: true,
      label: 'Home Layout',
    }
  ],
  hooks: {
    afterChange: [revalidateSettings],
  },
}
