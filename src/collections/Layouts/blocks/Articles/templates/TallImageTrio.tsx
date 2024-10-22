import { MediaFigure } from '@/components/MediaFigure'
import { TemplateProps } from '.'
import { PostItem } from '@/components/PostItem'

export async function TallImageTrio({ posts }: TemplateProps) {
  const [mainPost, ...otherPosts] = posts

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
      <div className="flex flex-col gap-3">
        <PostItem size="base" post={mainPost} />
        {otherPosts.map((post, index) => (
          <div key={index} className="border-t pt-5">
            <PostItem size="base" post={post} />
          </div>
        ))}
      </div>
      <MediaFigure
        href={`/posts/${mainPost.slug}`}
        media={mainPost.cover}
        loading="eager"
        className="w-full h-auto object-cover max-h-[60vw]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
      />
    </div>
  )
}
