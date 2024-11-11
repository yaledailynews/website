import type { StaticImageData } from 'next/image'

import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'

import type { Page, MediaBlock as MediaBlockProps } from '@payload-types'
import { MediaFigure } from '@/components/MediaFigure'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  id?: string
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    caption,
    position = 'default',
    staticImage,
    disableInnerContainer,
  } = props

  return (
    <div
      className={cn(
        {
          container: position === 'default' && enableGutter,
          // TODO: fix this at sm size
          'relative left-1/2 sm:left-[calc(50%_+_7.5px)] md:left-1/2 -translate-x-1/2 w-[100vw] flex justify-center':
            position === 'fullscreen' || position === 'wide',
          'lg:px-8 py-2 sm:py-3 md:py-5 lg:py-6': position === 'fullscreen',
          'lg:px-12 py-2 sm:py-3 md:py-5 lg:py-6': position === 'wide',
        },
        className,
      )}
    >
      <div
        className={cn('pb-2 bg-gray-100 border-y lg:border-x', {
          'max-w-screen-lg': position === 'wide',
          'max-w-screen-2xl': position === 'fullscreen',
        })}
      >
        <MediaFigure
          sizes="(max-width: 640px) 100vw, 640px"
          className={imgClassName}
          figureClassName="not-prose"
          creditClassName="px-2"
          media={media}
        />
        {caption && (
          <div
            className={cn(
              'text-sm mt-2 px-4 text-gray-700 border-l-gray-800 pb-2',
              captionClassName,
            )}
          >
            {caption}
          </div>
        )}
      </div>
    </div>
  )
}
