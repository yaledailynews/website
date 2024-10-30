// import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import type { Media as MediaType } from '@payload-types'
import { getDocById } from '@/utilities/cache'
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import { env } from '@/env'

export async function MediaFigure({
  media,
  href,
  figureClassName,
  priority = false,
  ...props
}: {
  media?: MediaType | string | number | null
  href?: string
  figureClassName?: string
  priority?: boolean
} & Partial<ImgHTMLAttributes<HTMLImageElement>>) {
  if (!media) return null
  if (typeof media === 'string') return null

  const { blurhash, alt, width, height, author, credit, filename } = await getDocById(
    'media',
    media,
  )()
  if (!filename) return null

  const resolvedAuthor = author ? await getDocById('authors', author)() : null

  const url = `${env.NEXT_PUBLIC_S3_URL}/${filename}`

  const ImageComponent =
    width && height ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={alt} loading={priority ? 'eager' : 'lazy'} {...props} />
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
