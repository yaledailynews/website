import colors from "tailwindcss/colors";
import type { Tag as TagType } from "@cms/payload-types";
import { getDocById } from "@site/lib/cache";
import type { SC } from "@site/lib/types";

type Props = { tag: TagType | number };

export const Tag: SC<Props> = async ({ tag }) => {
  const resolvedTag = await getDocById("tags", tag);
  const color = resolvedTag.color ? colors[resolvedTag.color] : colors.gray;
  return (
    <span
      class="px-2.5 py-[3px] text-xs font-medium text-white"
      style={{
        border: `1px solid ${color[500]}`,
        backgroundColor:
          resolvedTag.style === "solid" ? color[700] : color[100],
        color: resolvedTag.style === "solid" ? "white" : color[700],
      }}
    >
      {resolvedTag.title}
    </span>
  );
};
