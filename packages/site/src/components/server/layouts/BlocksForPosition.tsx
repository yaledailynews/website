import type { Layout as LayoutType, Post } from "@cms/payload-types";
import { LayoutBlock, type LayoutBlockType } from "./blocks/LayoutBlock";
import { cn } from "@site/lib/utils";
import type { SC } from "@site/lib/types";
import { getDocById } from "@site/lib/cache";

type Props = {
  layout: LayoutType;
  resolvedPosts: Map<number, Post[]>;
  position?: LayoutBlockType["desktopPosition"];
};

export const BlocksForPosition: SC<Props> = ({
  position,
  layout,
  resolvedPosts,
}) => {
  let displayIndex = 0;

  if (!layout.blocks) return <></>;

  return (
    <>
      {layout.blocks.map(async (block, index) => {
        if (position && block.desktopPosition !== position) return <></>;

        const hideBorder =
          displayIndex === 0 && block.desktopPosition === "main";
        const hideBorderMd =
          displayIndex === 0 && block.desktopPosition === "sidebar";

        displayIndex++;

        const posts = resolvedPosts.get(index);

        return (
          <div
            class={cn("grid gap-5 pb-3", {
              "border-t mt-2": !hideBorder,
              "md:border-t-0 md:mt-0 md:pt-0": hideBorderMd,
              "pt-2": !hideBorder && block.blockName,
              "pt-5": !hideBorder && !block.blockName,
              "md:pt-0": hideBorderMd && block.blockName,
              "border-t-gray-700":
                block.topDivider === "dark" || block.desktopPosition !== "main",
            })}
          >
            {block.blockName &&
              block.blockType === "layoutsArticles" &&
              (block.category ? (
                // TODO: better error handling here
                <a
                  href={`/categories/${(await getDocById("categories", block.category)).slug}`}
                >
                  <h2 class={cn("text-sm font-bold")}>{block.blockName}</h2>
                </a>
              ) : (
                <h2 class={cn("text-sm font-bold")}>{block.blockName}</h2>
              ))}
            <div class="flex flex-col gap-5">
              <LayoutBlock block={block} layout={layout} posts={posts} />
            </div>
          </div>
        );
      })}
    </>
  );
};
