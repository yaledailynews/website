import Link from 'next/link'
import { TemplateProps } from '.'
import { MediaFigure } from '@/components/MediaFigure'

export async function SimpleList({ posts }: TemplateProps) {
  return posts.map((post, i) => (
    <div className={i !== 0 ? `border-t pt-5` : undefined} key={post.slug}>
      <article className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
        <Link href={`/post/${post.slug}`} className="hover:opacity-70 transition-opacity">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <h1 className="font-headline text-xl">{post.title}</h1>
              <p className="font-serif text-gray-600 md:text-sm">{post.subhead}</p>
            </div>
            <p className="text-gray-500 text-xs">
              By {post.populatedAuthors?.map((author) => author.name).join(', ')}
            </p>
          </div>
        </Link>
        <MediaFigure
          media={post.cover}
          href={`/posts/${post.slug}`}
          className="w-full aspect-video object-cover max-h-[60vw]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
        />
      </article>
    </div>
  ))
}
