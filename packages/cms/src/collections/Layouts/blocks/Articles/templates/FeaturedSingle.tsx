import { TemplateProps } from '.'
import { MediaFigure } from '@cms/components/MediaFigure'
import { PostItem } from '@cms/components/PostItem'

export async function FeaturedSingle({ posts }: TemplateProps) {
  const [post] = posts

  return (
    <article className="grid gap-4 md:gap-3 grid-cols-1 sm:grid-cols-[1fr_1fr]">
      <PostItem post={post} size="xl" />
      <MediaFigure
        media={post.cover}
        href={`/posts/${post.slug}`}
        priority
        className='w-full'
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 30vw, 400px"
      />
    </article>
  )
}
