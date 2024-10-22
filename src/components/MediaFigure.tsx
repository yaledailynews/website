import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import type { Media as MediaType } from '@payload-types'
import { getDocById } from '@/utilities/cache'

export async function MediaFigure({
  media,
  href,
  figureClassName,
  ...props
}: {
  media?: MediaType | string | number | null
  href?: string
  figureClassName?: string
} & Partial<ImageProps>) {
  if (!media) return null
  if (typeof media === 'string') return null
  
  const resolvedMedia = await getDocById('media', media)()

  if (!resolvedMedia.url) return null

  const author = resolvedMedia.author ? await getDocById('authors', resolvedMedia.author)() : null

  const ImageComponent =
    resolvedMedia.width && resolvedMedia.height ? (
      <Image src={resolvedMedia.url} alt={resolvedMedia.alt} width={resolvedMedia.width} height={resolvedMedia.height} {...props} />
    ) : (
      <Image src={resolvedMedia.url} alt={resolvedMedia.alt} {...props} />
    )

  return (
    <figure
      className={'w-full flex flex-col items-end' + (figureClassName ? ` ${figureClassName}` : '')}
    >
      <div className="w-full mb-2">
        {href ? (
          <Link href={href} className="w-full">
            {ImageComponent}
          </Link>
        ) : (
          ImageComponent
        )}
      </div>
      {author ? (
        <figcaption className="text-xs text-gray-500">
          <Link href={`/authors/${author.slug}`}>{author.name}</Link>
        </figcaption>
      ) : (
        resolvedMedia.credit && <figcaption className="text-xs text-gray-500">{resolvedMedia.credit}</figcaption>
      )}
    </figure>
  )
}
