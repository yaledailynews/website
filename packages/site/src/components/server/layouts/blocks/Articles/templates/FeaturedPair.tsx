import { MediaFigure } from "@site/components/server/MediaFigure";
import type { TemplateProps } from ".";
import { PostItem } from "@site/components/server/PostItem";
import type { SC } from "@site/lib/types";

export const FeaturedPair: SC<TemplateProps> = ({ posts }) => {
  const [mainPost, secondaryPost] = posts;

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      <div class="lg:col-span-2 flex flex-col gap-5">
        <PostItem size="xl" post={mainPost} />
      </div>
      <MediaFigure
        media={mainPost.cover}
        figureClass="lg:col-span-3 lg:row-span-2 md:col-span-1"
        class="w-full"
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 30vw, 400px"
        href={`/posts/${mainPost.slug}`}
      />
      <div class="border-t pt-5 sm:col-span-2">
        <PostItem size="md" post={secondaryPost} hideSummary />
      </div>
    </div>
  );
};
