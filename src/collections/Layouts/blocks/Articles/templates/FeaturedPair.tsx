import { MediaFigure } from '@/components/MediaFigure'
import { TemplateProps } from '.'
import { PostItem } from '@/components/PostItem'

export async function FeaturedPair({ posts }: TemplateProps) {
  const [mainPost, secondaryPost] = posts

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        <PostItem size="2xl" post={mainPost} />
      </div>
      <MediaFigure
        media={mainPost.cover}
        figureClassName="lg:col-span-3 lg:row-span-2 md:col-span-1"
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 30vw, 400px"
        href={`/posts/${mainPost.slug}`}
      />
      <div className="border-t pt-5 sm:col-span-2">
        <PostItem size="md" post={secondaryPost} hideSummary />
      </div>
    </div>
  )
}
