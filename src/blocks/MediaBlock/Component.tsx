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
        'border rounded pb-4',
        {
          container: position === 'default' && enableGutter,
          'relative left-1/2 -translate-x-1/2 w-[100vw]': position === 'fullscreen',
        },
        className,
      )}
    >
      <MediaFigure
        sizes="(max-width: 640px) 100vw, 640px"
        className={cn('rounded', imgClassName)}
        figureClassName="not-prose"
        creditClassName="px-2"
        media={media}
      />
      {caption && (
        <div className={cn('text-sm mt-2 px-4 text-gray-700 border-l-gray-800', captionClassName)}>
          {caption}
        </div>
      )}
    </div>
  )
}
