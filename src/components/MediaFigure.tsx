"use server"

// import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import type { Media as MediaType } from '@payload-types'
import { getDocById } from '@/utilities/cache'
import { ImgHTMLAttributes } from 'react'
import { env } from '@/env'
import { cn } from '@/utilities/cn'

function generateSrcSet(sizes: NonNullable<MediaType['sizes']>): string {
  return Object.entries(sizes)
    .filter(([key, size]) => size.width && size.filename && !key.match('avatar'))
    .map(([, size]) => `${env.NEXT_PUBLIC_S3_URL}/${size.filename} ${size.width}w`)
    .join(', ')
}

export async function MediaFigure({
  media,
  href,
  figureClassName,
  priority = false,
  fullBleed,
  hideCredit,
  ...props
}: {
  media?: MediaType | string | number | null
  href?: string
  fullBleed?: boolean
  figureClassName?: string
  priority?: boolean
  hideCredit?: boolean
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
      {!hideCredit &&
        (resolvedAuthor ? (
          <figcaption
            className={cn('text-xs text-gray-500', {
              'px-3 sm:px-1 md:px-0': fullBleed,
            })}
          >
            <Link href={`/authors/${resolvedAuthor.slug}`}>{resolvedAuthor.name}</Link>
          </figcaption>
        ) : (
          credit && (
            <figcaption
              className={cn('text-xs text-gray-500', {
                'px-3 sm:px-1 md:px-0': fullBleed,
              })}
            >
              {credit}
            </figcaption>
          )
        ))}
    </figure>
  )
}
