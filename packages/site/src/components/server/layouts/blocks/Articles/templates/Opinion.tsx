import { ResolvedAuthors } from "@site/components/server/ResolvedAuthors";
import type { TemplateProps } from ".";
import type { SC } from "@site/lib/types";

export const Opinion: SC<TemplateProps> = ({ posts }) => {
  return (
    <>
      {posts.map((post, index) => (
        <div class={index > 0 ? "border-t pt-4" : ""}>
          <a
            href={`/posts/${post.slug}`}
            class="hover:opacity-70 transition-opacity"
          >
            <article class="flex flex-col gap-1">
              <p class="text-gray-500 md:text-sm">
                By <ResolvedAuthors post={post} />
              </p>
              <h1 class="font-headline text-xl md:text-lg">{post.title}</h1>
            </article>
          </a>
        </div>
      ))}
    </>
  );
};
