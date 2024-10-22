import { PostItem } from '@/components/PostItem'
import { TemplateProps } from '.'
import { MediaFigure } from '@/components/MediaFigure'

export async function LargeImageQuad({ posts }: TemplateProps) {
  const [mainPost, secondaryPost, ...otherPosts] = posts

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-5">
        <div className="flex flex-col gap-5">
          <div className="border-b pb-5">
            <PostItem size="xl" post={mainPost} />
          </div>
          <PostItem size="base" post={secondaryPost} />
        </div>
        <MediaFigure
          media={mainPost.cover}
          href={`/posts/${mainPost.slug}`}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
          className="w-full h-auto object-cover max-h-[60vw]"
        />
      </div>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 pt-5 border-t">
        {otherPosts.map((Post, index) => (
          <div
            key={index}
            className={index > 0 ? 'sm:pl-5 sm:border-l' : 'border-b pb-5 sm:pb-0 sm:border-b-0'}
          >
            <PostItem size="base" post={Post} hideSummary />
          </div>
        ))}
      </div>
    </>
  )
}
