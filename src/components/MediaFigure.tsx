// import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import type { Media as MediaType } from '@payload-types'
import { getDocById } from '@/utilities/cache'
import { ImgHTMLAttributes } from 'react'
import { env } from '@/env'

function generateSrcSet(sizes: NonNullable<MediaType['sizes']>): string {
  return Object.entries(sizes)
    .map(([key, size]) => `${env.NEXT_PUBLIC_S3_URL}/${size.filename} ${size.width}w`)
    .join(', ')
}

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

  const { alt, author, credit, sizes, filename, width, height } = await getDocById('media', media)()
  if (!filename || !width || !height) {
    return <div className="text-red-500">Missing filename, width, or height</div>
  }
  const resolvedAuthor = author ? await getDocById('authors', author)() : null

  if (!sizes) {
    return <div className="text-red-500">Missing sizes</div>
  }
  const srcSet = generateSrcSet(sizes)

  const url = `${env.NEXT_PUBLIC_S3_URL}/${filename}`

  const ImageComponent = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      srcSet={srcSet}
      {...props}
    />
  )

  return (
    <figure
      className={'w-full flex flex-col items-end' + (figureClassName ? ` ${figureClassName}` : '')}
    >
      <div className="w-full mb-2 bg-gray-200">
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
