import Link from 'next/link'
import { TemplateProps } from '.'
import { MediaFigure } from '@/components/MediaFigure'

export async function FeaturedSingle({ posts }: TemplateProps) {
  const [post] = posts

  return (
    <article className="grid gap-3 grid-cols-1 md:grid-cols-[1fr_1fr]">
      <Link href={`/posts/${post.slug}`} className="hover:opacity-70 transition-opacity">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-3xl md:text-2xl font-headline">{post.title}</h1>
            {post.subhead && (
              <p className="font-serif text-gray-600 text-lg md:text-base">{post.subhead}</p>
            )}
          </div>
          <div className="flex gap-3 items-center">
            <p className="text-gray-500 text-xs">
              By {post.populatedAuthors?.map((author) => author.name).join(', ')}
            </p>
          </div>
        </div>
      </Link>
      <MediaFigure
        media={post.cover}
        href={`/posts/${post.slug}`}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 20vw"
      />
    </article>
  )
}
