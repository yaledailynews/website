import type { BannerBlock as BannerBlockProps } from '@payload-types'

import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn('border py-1 px-6 flex items-center', {
          'border-sky-300 bg-sky-50': style === 'info',
          'border-rose-300 bg-rose-50': style === 'error',
          'border-green-300 bg-green-50': style === 'success',
          'border-amber-300 bg-amber-50': style === 'warning',
        })}
      >
        <RichText content={content} font="sans" size="md" />
      </div>
    </div>
  )
}
