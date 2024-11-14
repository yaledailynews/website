import { MediaFigure } from "@site/components/MediaFigure";
import type { TemplateProps } from ".";
import { PostItem } from "@site/components/PostItem";

export function TallImageTrio({ posts }: TemplateProps) {
  const [mainPost, ...otherPosts] = posts;

  return (
    <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
      <div class="flex flex-col gap-3">
        <PostItem size="md" post={mainPost} />
        {otherPosts.map((post) => (
          <div class="border-t pt-5">
            <PostItem size="md" post={post} />
          </div>
        ))}
      </div>
      <MediaFigure
        href={`/posts/${mainPost.slug}`}
        media={mainPost.cover}
        loading="eager"
        class="w-full h-auto object-cover max-h-[60vw]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
      />
    </div>
  );
}
