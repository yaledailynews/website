import Link from 'next/link'
import { TemplateProps } from '.'
import { MediaFigure } from '@/components/MediaFigure'
import { Tag } from '@/components/Tag'

export async function FeaturedSingle({ posts }: TemplateProps) {
  const [post] = posts

  return (
    <article className="grid gap-4 md:gap-3 grid-cols-1 sm:grid-cols-[1fr_1fr]">
      <Link href={`/posts/${post.slug}`} className="hover:opacity-70 transition-opacity">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-3xl md:text-2xl font-headline">{post.title}</h1>
            {post.subhead && (
              <p className="font-serif text-gray-600 text-lg md:text-base">{post.subhead}</p>
            )}
          </div>
          <div className="flex gap-3 items-center">
            {post.tags?.map((tag, i) => <Tag key={i} tag={tag} />)}
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
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 30vw, 400px"
      />
    </article>
  )
}
