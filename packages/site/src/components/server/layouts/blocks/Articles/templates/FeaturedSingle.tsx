import { MediaFigure } from "@site/components/server/MediaFigure";
import type { TemplateProps } from ".";
import { PostItem } from "@site/components/server/PostItem";
import type { SC } from "@site/lib/types";

export const FeaturedSingle: SC<TemplateProps> = ({ posts }) => {
  const [post] = posts;

  return (
    <article class="grid gap-4 md:gap-3 grid-cols-1 sm:grid-cols-[1fr_1fr]">
      <PostItem post={post} size="xl" />
      <MediaFigure
        media={post.cover}
        href={`/posts/${post.slug}`}
        priority
        class="w-full"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 30vw, 400px"
      />
    </article>
  );
};
