import type { CollectionConfig } from "payload";

import { anyone } from "@cms/access/anyone";
import { authenticated } from "@cms/access/authenticated";
import { slugField } from "@cms/fields/slug";
import { revalidateTagHook } from "./hooks/revalidateTag";

export const Tags: CollectionConfig = {
  slug: "tags",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "color"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "color",
      type: "select",
      options: [
        {
          label: "Gray",
          value: "gray",
        },
        {
          label: "Red",
          value: "red",
        },
        {
          label: "Orange",
          value: "orange",
        },
        {
          label: "Amber",
          value: "amber",
        },
        {
          label: "Yellow",
          value: "yellow",
        },
        {
          label: "Lime",
          value: "lime",
        },
        {
          label: "Green",
          value: "green",
        },
        {
          label: "Emerald",
          value: "emerald",
        },
        {
          label: "Teal",
          value: "teal",
        },
        {
          label: "Cyan",
          value: "cyan",
        },
        {
          label: "Sky",
          value: "sky",
        },
        {
          label: "Blue",
          value: "blue",
        },
        {
          label: "Indigo",
          value: "indigo",
        },
        {
          label: "Violet",
          value: "violet",
        },
        {
          label: "Purple",
          value: "purple",
        },
        {
          label: "Fuchsia",
          value: "fuchsia",
        },
        {
          label: "Pink",
          value: "pink",
        },
        {
          label: "Rose",
          value: "rose",
        },
      ],
      defaultValue: "gray",
      required: true,
    },
    {
      name: "style",
      type: "select",
      options: [
        {
          label: "Outline",
          value: "outline",
        },
        {
          label: "Solid",
          value: "solid",
        },
      ],
      defaultValue: "outline",
      required: true,
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidateTagHook],
  },
};
