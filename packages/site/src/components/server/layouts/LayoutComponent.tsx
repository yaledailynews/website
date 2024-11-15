import type { ResolvedLayout } from "@site/lib/resolveLayout";
import { BlocksForPosition } from "./BlocksForPosition";
import type { SC } from "@site/lib/types";

export const LayoutComponent: SC<ResolvedLayout> = ({ layout, resolvedPosts }) => {
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
};
