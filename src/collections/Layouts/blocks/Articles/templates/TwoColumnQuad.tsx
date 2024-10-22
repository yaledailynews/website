import { TemplateProps } from '.'
import { PostItem } from '@/components/PostItem'
import { MediaFigure } from '@/components/MediaFigure'

export async function TwoColumnQuad({ posts }: TemplateProps) {
  const [mainPost, secondaryPost, ...otherPosts] = posts

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5">
      <div className="flex flex-col gap-5 border-b pb-5 md:border-b-0 md:pb-0 md:border-r md:pr-5">
        <PostItem size="xl" post={mainPost} />
        <MediaFigure
          href={`/posts/${mainPost.slug}`}
          media={mainPost.cover}
          className="w-full h-auto object-cover max-h-[60vw]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 20vw"
        />
      </div>
      <div className="flex flex-col gap-5">
        <PostItem size="base" post={secondaryPost} />
        {otherPosts.map((post, index) => (
          <div key={index} className="border-t pt-5">
            <PostItem size="base" post={post} hideSummary />
          </div>
        ))}
      </div>
    </div>
  )
}
