'use server'

import Link from 'next/link'
import type { Media as MediaType } from '@payload-types'
import { getDocById } from '@/utilities/cache'
import { ImgHTMLAttributes } from 'react'
import { env } from '@/env'
import { cn } from '@/utilities/cn'
import { IconArticle, IconFile, IconFileFilled, IconPdf, IconPhoto } from '@tabler/icons-react'

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

  const { alt, author, credit, sizes, filename, width, height, mimeType } = await getDocById(
    'media',
    media,
  )()
  const resolvedAuthor = author ? await getDocById('authors', author)() : null

  let ImageComponent: React.ReactNode

  if (mimeType?.startsWith('image')) {
    if (!filename || !width || !height) {
      return (
        <div className="text-red-500 px-4 py-2 bg-red-200 border border-red-500 flex items-center gap-3">
          <IconPhoto size={24} />
          Missing filename, width, or height
        </div>
      )
    }

    if (!sizes) {
      return <div className="text-red-500">Missing sizes</div>
    }
    const srcSet = generateSrcSet(filename, width, sizes)

    const url = `${env.NEXT_PUBLIC_S3_URL}/${filename}`

    ImageComponent = (
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
  } else if (mimeType?.startsWith('video')) {
    ImageComponent = (
      <video controls className="w-full" preload="metadata">
        <source src={`${env.NEXT_PUBLIC_S3_URL}/${filename}`} type={mimeType} />
        Your browser does not support the video tag.
      </video>
    )
  } else if (mimeType?.startsWith('audio')) {
    ImageComponent = (
      <audio controls className="w-full" preload="metadata">
        <source src={`${env.NEXT_PUBLIC_S3_URL}/${filename}`} type={mimeType} />
        Your browser does not support the audio tag.
      </audio>
    )
  } else if (mimeType?.startsWith('application/pdf')) {
    ImageComponent = (
      <div className="flex flex-col bg-gray-800 w-full">
        <p className="text-xs px-4 py-2 text-white flex items-center gap-2">
          <IconFileFilled size={16} className="inline-block" />
          {filename}
        </p>
        <object
          data={`${env.NEXT_PUBLIC_S3_URL}/${filename}`}
          type={mimeType}
          className="w-full h-full border-b min-h-[calc(60vh+3rem)]"
        >
          <a href={`${env.NEXT_PUBLIC_S3_URL}/${filename}`}>Download PDF</a>
        </object>
      </div>
    )
  }

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
