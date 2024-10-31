import Link from 'next/link'
import { TemplateProps } from '.'
import { MediaFigure } from '@/components/MediaFigure'
import { ResolvedAuthors } from '@/components/ResolvedAuthors'

export async function SidebarTrio({ posts }: TemplateProps) {
  const [mainPost, secondaryPost, tertiaryPost] = posts

  return (
    <>
      <article className="flex flex-col gap-3">
        <MediaFigure
          media={mainPost.cover}
          className="w-full"
          href={`/posts/${mainPost.slug}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 20vw"
        />
        <Link
          href={`/posts/${mainPost.slug}`}
          className="hover:opacity-70 transition-opacity w-full"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl md:text-lg font-headline">{mainPost.title}</h1>
              <p className="text-gray-600 md:text-sm font-serif">{mainPost.subhead}</p>
            </div>
            <div className="flex gap-3 items-center">
              {/* {mainPost.tag && (
                <span className="text-sky-700 bg-sky-200 px-2 py-0.5 text-xs self-start">
                  {mainPost.tag.name}
                </span>
              )} */}
              <p className="text-gray-500 text-xs">
                By <ResolvedAuthors post={mainPost} />
              </p>
            </div>
          </div>
        </Link>
      </article>
      <article className="flex flex-col gap-3 border-t pt-5">
        <Link
          href={`/posts/${secondaryPost.slug}`}
          className="hover:opacity-70 transition-opacity w-full"
        >
          <div className="flex flex-col gap-3">
            <h1 className="font-headline text-lg">{secondaryPost.title}</h1>
            <div className="flex gap-3 items-center">
              {/* {mainPost.tag && (
                <span className="text-sky-700 bg-sky-200 px-2 py-0.5 text-xs self-start">
                  {mainPost.tag.name}
                </span>
              )} */}
              <p className="text-gray-500 text-xs">
                By <ResolvedAuthors post={secondaryPost} />
              </p>
            </div>
          </div>
        </Link>
      </article>
      <article className="grid grid-cols-2 gap-3 border-t pt-5">
        <Link
          href={`/posts/${tertiaryPost.slug}`}
          className="hover:opacity-70 transition-opacity w-full"
        >
          <div className="flex flex-col gap-3">
            <h1 className="font-headline">{tertiaryPost.title}</h1>
            <div className="flex gap-3 items-center">
              <p className="text-gray-500 text-xs">
                By <ResolvedAuthors post={tertiaryPost} />
              </p>
            </div>
          </div>
        </Link>
        <MediaFigure
          media={tertiaryPost.cover}
          href={`/posts/${tertiaryPost.slug}`}
          className="w-full aspect-[11/9] object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
      </article>
    </>
  )
}
