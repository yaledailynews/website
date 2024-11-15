import type { Post } from "@cms/payload-types";
import { Tag } from "./Tag";
import { ResolvedAuthors } from "./ResolvedAuthors";
import { cn } from "@site/lib/utils";
import type { SC } from "@site/lib/types";

type Props = {
  post: Post;
  size?: "xl" | "lg" | "md" | "sm";
  hideSummary?: boolean;
};

export const PostItem: SC<Props> = ({ post, size = "md", hideSummary }) => {
  return (
    <a href={`/posts/${post.slug}`} class="hover:opacity-70 transition-opacity">
      <article class="flex flex-col gap-3">
        <div
          class={cn("flex flex-col", {
            "gap-2.5 sm:gap-2": size === "xl",
            "gap-2 sm:gap-1.5": size === "lg",
            "gap-1.5 sm:gap-1": size === "md" || size === "sm",
          })}
        >
          <h1
            class={cn("font-headline", {
              "text-2xl": size === "xl",
              "text-2xl md:text-xl": size === "lg",
              "text-xl md:text-lg": size === "md",
              "text-lg md:text-sm": size === "sm",
            })}
          >
            {post.title}
          </h1>

          {post.subhead && !hideSummary && (
            <p
              class={cn("font-serif text-gray-600", {
                "text-base": size === "xl",
                "text-base md:text-sm": size === "lg",
                "text-sm md:text-sm": size === "md",
                "text-sm md:text-xs": size === "sm",
              })}
            >
              {post.subhead}
            </p>
          )}
        </div>
        <div class="flex gap-3 items-center">
          {post.tags && post.tags.length > 0 && (
            <div class="flex gap-2">
              {post.tags.map((tag) => (
                <Tag tag={tag} />
              ))}
            </div>
          )}
          <p class="text-gray-500 text-xs">
            By <ResolvedAuthors post={post} />
          </p>
        </div>
      </article>
    </a>
  );
};
