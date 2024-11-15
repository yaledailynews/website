import { PostItem } from "@site/components/server/PostItem";
import type { TemplateProps } from ".";
import { MediaFigure } from "@site/components/server/MediaFigure";
import type { SC } from "@site/lib/types";

export const SmallImageTrio: SC<TemplateProps> = ({ posts }) => {
  const [mainPost, ...otherPpsts] = posts;

  return (
    <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
      <div class="flex flex-col gap-3">
        <PostItem size="md" post={mainPost} hideSummary />
        {otherPpsts.map((post) => (
          <div class="border-t pt-5">
            <PostItem size="md" post={post} hideSummary />
          </div>
        ))}
      </div>
      <MediaFigure
        href={`/posts/${mainPost.slug}`}
        media={mainPost.cover}
        class="w-full h-auto object-cover max-h-[60vw]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
      />
    </div>
  );
};
