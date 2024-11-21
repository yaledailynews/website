import type { CollectionConfig } from "payload";

import {
  BlockquoteFeature,
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";

import { authenticated } from "@cms/access/authenticated";
import { authenticatedOrPublished } from "@cms/access/authenticatedOrPublished";
import { Banner } from "@cms/blocks/Banner";
import { MediaBlock } from "@cms/blocks/Media";
import { revalidatePost } from "./hooks/revalidatePost";

import { slugField } from "@cms/fields/slug";
import { addToMeili } from "@cms/hooks/addToMeili";
import { Embed } from "@cms/blocks/Embed";
import { generatePreviewUrl } from "@cms/utilities/generatePreviewUrl";

export const Posts: CollectionConfig = {
  slug: "posts",
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["title", "slug", "updatedAt"],
    preview: (data) => generatePreviewUrl("posts", data.id as number),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "subhead",
      type: "textarea",
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Cover Image",
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
            BlocksFeature({ blocks: [Banner, MediaBlock, Embed] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
            OrderedListFeature(),
            UnorderedListFeature(),
            BlockquoteFeature(),
          ];
        },
      }),
      label: false,
      required: true,
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
      validate(date) {
        console.log(date);
        if (date && new Date(date) > new Date()) {
          return "Scheduling a post is not yet supported.";
        }
        return true;
      },
    },
    {
      name: "categories",
      type: "relationship",
      admin: {
        position: "sidebar",
      },
      hasMany: true,
      relationTo: "categories",
    },
    {
      name: "tags",
      type: "relationship",
      admin: {
        position: "sidebar",
      },
      hasMany: true,
      relationTo: "tags",
    },
    {
      name: "authors",
      type: "relationship",
      admin: {
        position: "sidebar",
      },
      hasMany: true,
      relationTo: "authors",
    },
    {
      name: "heroStyle",
      type: "select",
      options: [
        { label: "Standard", value: "standard" },
        { label: "Full Width", value: "full" },
      ],
      defaultValue: "standard",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    ...slugField("title"),
  ],
  hooks: {
    afterChange: [revalidatePost, addToMeili],
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
