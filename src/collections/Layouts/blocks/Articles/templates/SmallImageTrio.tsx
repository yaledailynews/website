import { PostItem } from '@/components/PostItem'
import { TemplateProps } from '.'
import { MediaFigure } from '@/components/MediaFigure'

export async function SmallImageTrio({ posts }: TemplateProps) {
  const [mainPost, ...otherPpsts] = posts

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
      <div className="flex flex-col gap-3">
        <PostItem size="base" post={mainPost} hideSummary />
        {otherPpsts.map((post, index) => (
          <div key={index} className="border-t pt-5">
            <PostItem size="base" post={post} hideSummary />
          </div>
        ))}
      </div>
      <MediaFigure
        href={`/posts/${mainPost.slug}`}
        media={mainPost.cover}
        className="w-full h-auto object-cover max-h-[60vw]"
      />
    </div>
  )
}
