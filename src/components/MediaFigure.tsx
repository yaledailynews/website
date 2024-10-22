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

  const { url, placeholder, alt, width, height, author, credit } = await getDocById('media', media)()
  if (!url) return null

  const resolvedAuthor = author ? await getDocById('authors', author)() : null

  const blur = placeholder || undefined

  const ImageComponent =
    width && height ? (
      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        blurDataURL={blur}
        placeholder={blur ? "blur" : "empty"}
        {...props}
      />
    ) : (
      <Image src={url} alt={alt} blurDataURL={blur} placeholder={blur ? "blur" : "empty"} {...props} />
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
      {resolvedAuthor ? (
        <figcaption className="text-xs text-gray-500">
          <Link href={`/authors/${resolvedAuthor.slug}`}>{resolvedAuthor.name}</Link>
        </figcaption>
      ) : (
        credit && <figcaption className="text-xs text-gray-500">{credit}</figcaption>
      )}
    </figure>
  )
}
