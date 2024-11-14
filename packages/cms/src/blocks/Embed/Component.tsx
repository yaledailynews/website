import { cn } from '@cms/utilities/cn'
import { EmbedBlock as EmbedBlockType } from '@cms/payload-types'
import React from 'react'

type Props = EmbedBlockType & {
  className?: string
}

export const EmbedBlock: React.FC<Props> = ({ className, url, aspectRatio, caption }) => {
  return (
    <div className={cn('bg-gray-100 border not-prose', className)}>
      <iframe
        src={url}
        style={{
          aspectRatio: aspectRatio?.split(':').map(Number).join('/'),
          width: '100%',
        }}
        frameBorder="0"
        allowFullScreen
      />
      {caption && (
        <p className="text-sm mt-2 px-4 text-gray-700 border-l-gray-800 pb-2">
          {caption}
        </p>
      )}
    </div>
  )
}
