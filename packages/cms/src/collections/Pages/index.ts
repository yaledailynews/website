import type { CollectionConfig } from "payload";

import { authenticated } from "@cms/access/authenticated";
import { authenticatedOrPublished } from "@cms/access/authenticatedOrPublished";
import { slugField } from "@cms/fields/slug";
import { populatePublishedAt } from "@cms/hooks/populatePublishedAt";
import { revalidatePage } from "./hooks/revalidatePage";

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

import { Banner } from "@cms/blocks/Banner";
import { MediaBlock } from "@cms/blocks/Media";
import { Embed } from "@cms/blocks/Embed";
import { generatePreviewUrl } from "@cms/utilities/generatePreviewUrl";
// import { env } from '@cms/env'

export const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["title", "slug", "updatedAt"],
    preview: (data) => generatePreviewUrl("pages", data.id as number),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
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
        if (date && date > new Date()) {
          return "Scheduling a post is not yet supported, although we plan to add this feature.";
        }
        return true;
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
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
