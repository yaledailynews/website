import type { Media as MediaType } from '@cms/payload-types'
import { getDocById } from '@cms/utilities/cache'
import { ImgHTMLAttributes } from 'react'
import { env } from '@cms/env'

export async function AvatarImage({
  media,
  size,
  ...props
}: {
  media?: MediaType | string | number | null
  size: 'sm' | 'lg'
} & Partial<ImgHTMLAttributes<HTMLImageElement>>) {
  if (!media) return null
  if (typeof media === 'string') return null

  const { alt, sizes } = await getDocById('media', media)()
  if (!sizes || !sizes || !alt) {
    return <div className="text-red-500">Missing sizes or alt</div>
  }
  const avatar = sizes[`avatar-${size}`]
  if (!avatar || !avatar.filename || !avatar.width || !avatar.height) {
    return <div className="text-red-500">Missing avatar</div>
  }
  const url = `${env.NEXT_PUBLIC_S3_URL}/${avatar.filename}`

  return (
    <img
      src={url}
      alt={alt}
      width={avatar.width}
      height={avatar.height}
      loading="lazy"
      {...props}
    />
  )
}
