import { authenticated } from "@cms/access/authenticated";
import { authenticatedOrPublished } from "@cms/access/authenticatedOrPublished";
import { slugField } from "@cms/fields/slug";
import { CollectionConfig } from "payload";
import { Text } from "@cms/collections/Layouts/blocks/Text";
import { Articles } from "@cms/collections/Layouts/blocks/Articles";
import { Podcasts } from "@cms/collections/Layouts/blocks/Podcasts";
import { Newsletter } from "@cms/collections/Layouts/blocks/Newsletter";
import { revalidateLayout } from "./hooks/revalidateLayout";
import { generatePreviewUrl } from "@cms/utilities/generatePreviewUrl";

export const Layouts: CollectionConfig = {
  slug: "layouts",
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["title", "slug", "publishedAt"],
    preview: (data) => generatePreviewUrl("layouts", data.id as number),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    ...slugField(),
    {
      name: "template",
      type: "select",
      options: [
        { label: "Standard", value: "standard" },
        { label: "Category", value: "category" },
        { label: "Special Issue", value: "special-issue" },
        { label: "Magazine", value: "magazine" },
        { label: "Podcast", value: "podcast" },
      ],
      defaultValue: "standard",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "blocks",
      type: "blocks",
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
};
