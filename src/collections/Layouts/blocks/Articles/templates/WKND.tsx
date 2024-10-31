import Link from 'next/link'
import React from 'react'
import { Post } from '@payload-types'
import { MediaFigure } from '@/components/MediaFigure'
import { TemplateProps } from '.'
import { ResolvedAuthors } from '@/components/ResolvedAuthors'

function WKNDPost({ post }: { post: Post }) {
  return (
    <article className="flex flex-col gap-1">
      <MediaFigure
        href={`/posts/${post.slug}`}
        media={post.cover}
        className="w-full aspect-[11/9] object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 30vw"
      />
      <Link href={`/posts/${post.slug}`} className="hover:opacity-70 transition-opacity">
        <h1 className="font-headline text-xl md:text-lg">{post.title}</h1>
        <p className="text-gray-500 text-sm">
          By <ResolvedAuthors post={post} />
        </p>
      </Link>
    </article>
  )
}

export async function WKND({ posts }: TemplateProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_1px_1fr] md:grid-cols-[1fr] lg:grid-cols-[1fr_1px_1fr] gap-x-4 gap-y-6">
        {posts.map((post, index) => (
          <React.Fragment key={index}>
            <WKNDPost post={post} />
            {index % 2 === 0 && <div className="bg-gray-200 md:h-px lg:h-auto" />}
            {index % 2 === 1 && <div className="bg-gray-200 hidden h-px md:block lg:hidden" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
