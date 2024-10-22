import { Fragment } from 'react'
import Link from 'next/link'
import { Post } from '@payload-types'
import { TemplateProps } from '.'
import { MediaFigure } from '@/components/MediaFigure'

const seeMoreLink = '/categories/magazine'

function MagazinePostItem({ post }: { post: Post }) {
  return (
    <article className="flex flex-col gap-2">
      <MediaFigure
        media={post.cover}
        href={`/article/${post.slug}`}
        className="w-full border aspect-[14/9] object-cover max-h-[60vw]"
      />
      <Link href={`/article/${post.slug}`} className="hover:opacity-70 transition-opacity">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline text-xl md:text-lg ">{post.title}</h1>
          <div className="flex gap-3 sm:items-center flex-col-reverse sm:flex-row items-start">
            {/* {post.tag && (
              <span className="text-gray-700 border border-gray-300 px-2 py-0.5 text-xs">
                {post.tag.name}
              </span>
            )} */}
            <p className="text-gray-500 text-sm font">
              By {post.populatedAuthors?.map((author) => author.name).join(', ')}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}

export async function Magazine({ posts }: TemplateProps) {
  return (
    <>
      <div className="grid grid-cols-[1fr_1px_1fr] md:grid-cols-[1fr_1px_1fr_1px_1fr_1px_1fr] gap-x-4 gap-y-6">
        {posts.map((post, index) => (
          <Fragment key={index}>
            <MagazinePostItem post={post} />
            <div
              className={`
							w-px h-full bg-gray-200
							${index % 2 === 1 ? 'hidden' : ''}
              ${index % 4 !== 3 ? 'md:block' : ''}
						`}
            />
          </Fragment>
        ))}
      </div>
      <p className="text-gray-500 text-sm mt-8">
        <Link
          href={seeMoreLink}
          className="text-sky-700 underline hover:opacity-70 transition-opacity"
        >
          See more from YDN Magazine
        </Link>
      </p>
    </>
  )
}
