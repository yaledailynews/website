import type { TextField } from "payload";

import { formatSlugHook } from "./formatSlug";

type Slug = (fieldToUse?: string) => [TextField];

export const slugField: Slug = (fieldToUse = "title") => {
  const slugField: TextField = {
    name: "slug",
    type: "text",
    index: true,
    label: "Slug",
    required: true,
    unique: true,
    hooks: {
      // Kept this in for hook or API based updates
      beforeValidate: [formatSlugHook(fieldToUse)],
    },
    admin: {
      position: "sidebar",
      description:
        "Warning: Modifying the slug will change the URL of this page and may break links.",
    },
  };

  return [slugField];
};
