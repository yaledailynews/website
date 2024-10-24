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
    position = 'default',
    staticImage,
    disableInnerContainer,
  } = props

  // let caption
  // if (media && typeof media === 'object') caption = media.caption

  return (
    <div
      className={cn(
        '',
        {
          container: position === 'default' && enableGutter,
        },
        className,
      )}
    >
      {position === 'fullscreen' && (
        <div className="relative">
          <MediaFigure
            media={media}
            src={staticImage}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 90vw"
          />
        </div>
      )}
      {position === 'default' && (
        <MediaFigure
          className={cn('rounded', imgClassName)}
          media={media}
          src={staticImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
        />
      )}
      {/* {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: position === 'fullscreen' && !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText content={caption} font='sans' size='sm' />
        </div>
      )} */}
    </div>
  )
}
