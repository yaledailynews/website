import type { TemplateProps } from ".";
import { MediaFigure } from "@site/components/server/MediaFigure";
import { ResolvedAuthors } from "@site/components/server/ResolvedAuthors";
import type { SC } from "@site/lib/types";

const seeMoreLink = "/categories/magazine";

export const Magazine: SC<TemplateProps> = ({ posts }) => {
  return (
    <>
      <div class="grid grid-cols-[1fr_1px_1fr] md:grid-cols-[1fr_1px_1fr_1px_1fr_1px_1fr] gap-x-4 gap-y-6">
        {posts.map((post, index) => (
          <>
            <article class="flex flex-col gap-2">
              <MediaFigure
                media={post.cover}
                href={`/posts/${post.slug}`}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 20vw"
                class="w-full border aspect-[14/9] object-cover max-h-[60vw]"
              />
              <a
                href={`/posts/${post.slug}`}
                class="hover:opacity-70 transition-opacity"
              >
                <div class="flex flex-col gap-2">
                  <h1 class="font-headline text-xl md:text-lg ">
                    {post.title}
                  </h1>
                  <div class="flex gap-3 sm:items-center flex-col-reverse sm:flex-row items-start">
                    {/* {post.tag && (
                      <span class="text-gray-700 border border-gray-300 px-2 py-0.5 text-xs">
                        {post.tag.name}
                      </span>
                    )} */}
                    <p class="text-gray-500 text-sm font">
                      By <ResolvedAuthors post={post} />
                    </p>
                  </div>
                </div>
              </a>
            </article>
            <div
              class={`
							w-px h-full bg-gray-200
							${index % 2 === 1 ? "hidden" : ""}
              ${index % 4 !== 3 ? "md:block" : ""}
						`}
            />
          </>
        ))}
      </div>
      <p class="text-gray-500 text-sm mt-8">
        <a
          href={seeMoreLink}
          class="text-sky-700 underline hover:opacity-70 transition-opacity"
        >
          See more from YDN Magazine
        </a>
      </p>
    </>
  );
};
