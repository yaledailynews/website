'use server'

import Link from 'next/link'
import type { Media as MediaType } from '@payload-types'
import { getDocById } from '@/utilities/cache'
import { ImgHTMLAttributes } from 'react'
import { env } from '@/env'
import { cn } from '@/utilities/cn'

function generateSrcSet(
  filename: string,
  width: number,
  sizes: NonNullable<MediaType['sizes']>,
): string {
  return (
    `${env.NEXT_PUBLIC_S3_URL}/${filename} ${width}w, ` +
    Object.entries(sizes)
      .filter(([key, size]) => size.width && size.filename && !key.match('avatar'))
      .map(([, size]) => `${env.NEXT_PUBLIC_S3_URL}/${size.filename} ${size.width}w`)
      .join(', ')
  )
}

export async function MediaFigure({
  media,
  href,
  figureClassName,
  creditClassName,
  imgContainerClassName,
  priority = false,
  fullBleed,
  hideCredit,
  caption,
  overlay,
  ...props
}: {
  media?: MediaType | string | number | null
  href?: string
  fullBleed?: 'sm' | 'md' | 'lg'
  figureClassName?: string
  creditClassName?: string
  imgContainerClassName?: string
  priority?: boolean
  hideCredit?: boolean
  caption?: string | null
  overlay?: React.ReactNode
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
  const srcSet = generateSrcSet(filename, width, sizes)

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
      <div className={`w-full mb-2 bg-gray-200 ${imgContainerClassName}`}>
        {href ? (
          <Link href={href} className="w-full">
            {ImageComponent}
          </Link>
        ) : (
          ImageComponent
        )}
        {overlay}
      </div>
      {!hideCredit &&
        (resolvedAuthor ? (
          <figcaption
            className={cn(
              'text-xs text-gray-500',
              {
                'px-3': !!fullBleed,
                'md:px-0': fullBleed === 'sm',
                'lg:px-0': fullBleed === 'md',
              },
              creditClassName,
            )}
          >
            <Link href={`/authors/${resolvedAuthor.slug}`}>{resolvedAuthor.name}</Link>
          </figcaption>
        ) : (
          credit && (
            <figcaption
              className={cn(
                'text-xs text-gray-500',
                {
                  'px-3': !!fullBleed,
                  'md:px-0': fullBleed === 'sm',
                  'lg:px-0': fullBleed === 'md',
                },
                creditClassName,
              )}
            >
              {credit}
            </figcaption>
          )
        ))}
    </figure>
  )
}
