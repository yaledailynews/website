import { ResolvedAuthors } from "@site/components/ResolvedAuthors";
import type { TemplateProps } from ".";
import { MediaFigure } from "@site/components/MediaFigure";

export function WKND({ posts }: TemplateProps) {
  return (
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-[1fr_1px_1fr] md:grid-cols-[1fr] lg:grid-cols-[1fr_1px_1fr] gap-x-4 gap-y-6">
        {posts.map((post, index) => (
          <>
            <article class="flex flex-col gap-1">
              <MediaFigure
                href={`/posts/${post.slug}`}
                media={post.cover}
                class="w-full aspect-[11/9] object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 30vw"
              />
              <a
                href={`/posts/${post.slug}`}
                class="hover:opacity-70 transition-opacity"
              >
                <h1 class="font-headline text-xl md:text-lg">
                  {post.title}
                </h1>
                <p class="text-gray-500 text-sm">
                  By <ResolvedAuthors post={post} />
                </p>
              </a>
            </article>
            {index % 2 === 0 && (
              <div class="bg-gray-200 md:h-px lg:h-auto" />
            )}
            {index % 2 === 1 && (
              <div class="bg-gray-200 hidden h-px md:block lg:hidden" />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
