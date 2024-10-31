import { getDocById } from '@/utilities/cache'
import { Post } from '@payload-types'
import Link from 'next/link'
import { Tag } from './Tag'
import { cn } from '@/utilities/cn'

export async function PostItem({
  post,
  size = 'lg',
  hideSummary = false,
}: {
  post: Post
  hideSummary?: boolean
  size?: 'xl' | 'lg' | 'md' | 'sm'
}) {
  const resolvedAuthors = await Promise.all(
    (post.authors || []).map((author) => getDocById('authors', author)()),
  )

  return (
    <Link href={`/posts/${post.slug}`} className="hover:opacity-70 transition-opacity">
      <article className="flex flex-col gap-3">
        <div
          className={cn('flex flex-col', {
            'gap-2.5 sm:gap-2': size === 'xl',
            'gap-2 sm:gap-1.5': size === 'lg',
            'gap-1.5 sm:gap-1': size === 'md' || size === 'sm',
          })}
        >
          <h1
            className={cn('font-headline', {
              'text-2xl': size === 'xl',
              'text-2xl md:text-xl': size === 'lg',
              'text-xl md:text-lg': size === 'md',
              'text-lg md:text-sm': size === 'sm',
            })}
          >
            {post.title}
          </h1>

          {post.subhead && !hideSummary && (
            <p
              className={cn('font-serif text-gray-600', {
                'text-base': size === 'xl',
                'text-base md:text-sm': size === 'lg',
                'text-sm md:text-sm': size === 'md',
                'text-sm md:text-xs': size === 'sm',
              })}
            >
              {post.subhead}
            </p>
          )}
        </div>
        <div className="flex gap-3 items-center">
          {post.tags && <Tag tag={post.tags[0]} />}
          <p className="text-gray-500 text-xs">
            By {resolvedAuthors.map((author) => author.name).join(', ')}
          </p>
        </div>
      </article>
    </Link>
  )
}
