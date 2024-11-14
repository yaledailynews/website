import Link from 'next/link'
import { TemplateProps } from '.'
import { getDocById } from '@cms/utilities/cache'
import { ResolvedAuthors } from '@cms/components/ResolvedAuthors'

export async function Opinion({ posts }: TemplateProps) {

  return posts.map((post, index) => (
    <div key={index} className={index > 0 ? 'border-t pt-4' : ''}>
      <Link href={`/posts/${post.slug}`} className="hover:opacity-70 transition-opacity">
        <article className="flex flex-col gap-1">
          <p className="text-gray-500 md:text-sm">
            By <ResolvedAuthors post={post} />
          </p>
          <h1 className="font-headline text-xl md:text-lg">{post.title}</h1>
        </article>
      </Link>
    </div>
  ))
}
