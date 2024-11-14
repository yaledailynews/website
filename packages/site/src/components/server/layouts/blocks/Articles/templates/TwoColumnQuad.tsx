import { MediaFigure } from "@site/components/MediaFigure";
import type { TemplateProps } from ".";
import { PostItem } from "@site/components/PostItem";

export function TwoColumnQuad({ posts }: TemplateProps) {
  const [mainPost, secondaryPost, ...otherPosts] = posts;

  return (
    <div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5">
      <div class="flex flex-col gap-5 border-b pb-5 md:border-b-0 md:pb-0 md:border-r md:pr-5">
        <PostItem size="xl" post={mainPost} />
        <MediaFigure
          href={`/posts/${mainPost.slug}`}
          media={mainPost.cover}
          class="w-full h-auto object-cover max-h-[60vw]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
        />
      </div>
      <div class="flex flex-col gap-5">
        <PostItem size="md" post={secondaryPost} />
        {otherPosts.map((post) => (
          <div class="border-t pt-5">
            <PostItem size="md" post={post} hideSummary />
          </div>
        ))}
      </div>
    </div>
  );
}
