
import type { Layout as LayoutType, Post } from "@cms/payload-types";
import type { LayoutQuery } from "@site/lib/layoutQuery";
import { LayoutBlock, type LayoutBlockType } from "./blocks/LayoutBlock";
import { getDocById } from "@cms/utilities/cache";
import { cn } from "@site/lib/utils";

export function LayoutComponent({ layout, resolvedPosts }: LayoutQuery) {
  if (!layout.blocks) return <div>Layout has no blocks</div>;

  const hideSidebar = layout.template !== "standard";

  return (
    <>
      <main
        class={
          "flex-col gap-4 px-4 md:px-0 hidden md:flex" +
          (hideSidebar ? " max-w-3xl mx-auto" : "")
        }
      >
        <BlocksForPosition
          layout={layout}
          position="fullTop"
          resolvedPosts={resolvedPosts}
        />
        <div
          class={
            "grid grid-cols-1 gap-4" +
            (!hideSidebar ? " md:grid-cols-[5fr_2fr]" : "")
          }
        >
          <div
            class={
              "flex flex-col gap-5" +
              (!hideSidebar ? " md:border-r md:border-r-gray-400 md:pr-4" : "")
            }
          >
            <BlocksForPosition
              layout={layout}
              position="main"
              resolvedPosts={resolvedPosts}
            />
          </div>
          {!hideSidebar && (
            <div class="flex flex-col gap-5 border-t border-t-gray-800 pt-5 mt-5 md:border-t-0 md:pt-0 md:mt-0">
              <BlocksForPosition
                layout={layout}
                position="sidebar"
                resolvedPosts={resolvedPosts}
              />
            </div>
          )}
        </div>
        <BlocksForPosition
          layout={layout}
          position="fullBottom"
          resolvedPosts={resolvedPosts}
        />
      </main>
      <main class="flex flex-col gap-4 px-4 md:px-0 md:hidden">
        <BlocksForPosition layout={layout} resolvedPosts={resolvedPosts} />
      </main>
    </>
  );
}

function BlocksForPosition({
  position,
  layout,
  resolvedPosts,
}: {
  layout: LayoutType;
  resolvedPosts: Map<number, Post[]>;
  position?: LayoutBlockType["desktopPosition"];
}) {
  let displayIndex = 0;

  if (!layout.blocks) return null;

  return (
    <>
      {layout.blocks.map(async (block, index) => {
        if (position && block.desktopPosition !== position) return null;

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
                  href={`/categories/${(await getDocById("categories", block.category)())!.slug}`}
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
}
