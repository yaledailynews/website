import { ResolvedAuthors } from "@site/components/ResolvedAuthors";
import type { TemplateProps } from ".";
import { MediaFigure } from "@site/components/MediaFigure";

export function SimpleList({ posts }: TemplateProps) {
  return (
    <>
      {posts.map((post, i) => (
        <div class={i !== 0 ? `border-t pt-5` : undefined}>
          <article class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
            <a
              href={`/post/${post.slug}`}
              class="hover:opacity-70 transition-opacity"
            >
              <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-2">
                  <h1 class="font-headline text-xl">{post.title}</h1>
                  <p class="font-serif text-gray-600 md:text-sm">
                    {post.subhead}
                  </p>
                </div>
                <p class="text-gray-500 text-xs">
                  By <ResolvedAuthors post={post} />
                </p>
              </div>
            </a>
            <MediaFigure
              media={post.cover}
              href={`/posts/${post.slug}`}
              class="w-full aspect-video object-cover max-h-[60vw]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
            />
          </article>
        </div>
      ))}
    </>
  );
}
