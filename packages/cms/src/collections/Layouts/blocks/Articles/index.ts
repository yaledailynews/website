import { ArticlesBlock } from "@cms/payload-types";
import { Block } from "payload";

export type TemplateName = Exclude<ArticlesBlock["template"], number>;

export const templateConstraints: Record<
  TemplateName,
  { min: number; auto: number; max: number; multiple?: number }
> = {
  FeaturedPair: { min: 2, auto: 2, max: 2 },
  FeaturedSingle: { min: 1, auto: 1, max: 1 },
  LargeImageQuad: { min: 4, auto: 4, max: 4 },
  Magazine: { min: 4, auto: 8, max: 16, multiple: 4 },
  Opinion: { min: 2, auto: 8, max: 14 },
  SidebarTrio: { min: 3, auto: 3, max: 3 },
  SmallImageTrio: { min: 3, auto: 3, max: 3 },
  TallImageTrio: { min: 3, auto: 3, max: 3 },
  TwoColumnQuad: { min: 4, auto: 4, max: 4 },
  SimpleList: { min: 1, auto: 3, max: 16 },
  WKND: { min: 2, auto: 8, max: 16 },
};

export const Articles: Block = {
  slug: "layoutsArticles",
  labels: {
    singular: "Articles",
    plural: "Articles",
  },
  interfaceName: "ArticlesBlock",
  fields: [
    {
      name: "template",
      type: "select",
      options: [
        { label: "Simple List", value: "SimpleList" },
        { label: "Featured Single", value: "FeaturedSingle" },
        { label: "Featured Pair", value: "FeaturedPair" },
        { label: "Small Image Trio", value: "SmallImageTrio" },
        { label: "Tall Image Trio", value: "TallImageTrio" },
        { label: "Two Column Quad", value: "TwoColumnQuad" },
        { label: "Large Image Quad", value: "LargeImageQuad" },
        { label: "Opinion", value: "Opinion" },
        { label: "WKND", value: "WKND" },
        { label: "Magazine", value: "Magazine" },
        { label: "SidebarTrio", value: "SidebarTrio" },
      ],
      required: true,
    },
    {
      name: "desktopPosition",
      label: "Desktop Position",
      type: "select",
      // hidden: true,
      options: [
        { label: "Main", value: "main" },
        { label: "Sidebar", value: "sidebar" },
        { label: "Full Width at Top", value: "fullTop" },
        { label: "Full Width at Bottom", value: "fullBottom" },
      ],
      defaultValue: "main",
      admin: {
        readOnly: true,
        components: {
          Field: {
            path: "@cms/collections/Layouts/blocks/Articles/AutomaticPosition.tsx#AutomaticPositionComponent",
          },
        },
      },
    },
    {
      name: "source",
      type: "select",
      options: [
        { label: "Manual", value: "manual" },
        { label: "Latest from category", value: "latestFromCategory" },
      ],
      required: true,
      defaultValue: "manual",
    },
    {
      name: "posts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
      minRows: 1,
      maxRows: 16,
      label: "Articles",
      admin: {
        isSortable: true,
        condition(data, siblingData) {
          return siblingData.source === "manual";
        },
      },
      validate(value, { siblingData }) {
        const typedSiblingData = siblingData as ArticlesBlock;
        if (typedSiblingData.source === "manual") {
          const numArticles = typedSiblingData.posts?.length || 0;
          const { min, max, multiple } =
            templateConstraints[typedSiblingData.template];
          if (numArticles < min) {
            return `This template requires at least ${min} articles`;
          }
          if (numArticles > max) {
            return `This template supports at most ${max} articles`;
          }
          if (multiple && numArticles % multiple !== 0) {
            return `This template requires a multiple of ${multiple} articles`;
          }
        }
        return true;
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Category",
      admin: {
        condition(data, siblingData) {
          return siblingData.source === "latestFromCategory";
        },
      },
    },
    {
      name: "topDivider",
      label: "Top Divider",
      type: "select",
      options: [
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
      ],
      defaultValue: "dark",
      required: true,
    },
  ],
};
