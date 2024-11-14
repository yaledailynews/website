import { MediaFigure } from "@site/components/MediaFigure";
import type { TemplateProps } from ".";
import { PostItem } from "@site/components/PostItem";

export function LargeImageQuad({ posts }: TemplateProps) {
  const [mainPost, secondaryPost, ...otherPosts] = posts;

  return (
    <>
      <div class="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5">
        <div class="flex flex-col gap-5">
          <div class="border-b pb-5">
            <PostItem size="lg" post={mainPost} />
          </div>
          <PostItem size="md" post={secondaryPost} />
        </div>
        <MediaFigure
          media={mainPost.cover}
          href={`/posts/${mainPost.slug}`}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 30vw, 400px"
          class="w-full h-auto object-cover max-h-[60vw]"
        />
      </div>
      <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 pt-5 border-t">
        {otherPosts.map((Post, index) => (
          <div
            class={
              index > 0
                ? "sm:pl-5 sm:border-l"
                : "border-b pb-5 sm:pb-0 sm:border-b-0"
            }
          >
            <PostItem size="md" post={Post} hideSummary />
          </div>
        ))}
      </div>
    </>
  );
}
