import type { GlobalConfig } from "payload";

import { link } from "@cms/fields/link";
import { revalidateHeader } from "./hooks/revalidateHeader";

export const Header: GlobalConfig = {
  slug: "header",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "navItems",
      type: "array",
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 14,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
};
