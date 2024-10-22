import type { CollectionBeforeChangeHook } from 'payload'
import { Media } from '@payload-types'
import sharp from 'sharp'

export const generateBlur: CollectionBeforeChangeHook<Media> = async ({
  data,
  req: { payload, file },
}) => {
  if (!data.mimeType?.startsWith('image/')) {
    return data
  }
  if (file == null || !('data' in file)) {
    return data
  }
  const fileData = file.data
  if (!Buffer.isBuffer(fileData)) {
    return data
  }

  try {
    payload.logger.info('Generating blur placeholder for image')
    const resizedImageBuffer = await sharp(fileData)
      .resize(30) // Downscale the image to a small size
      .toBuffer()

    // Convert to base64 and create a data URI
    const base64Placeholder = resizedImageBuffer.toString('base64')
    const dataUri = `data:${data.mimeType};base64,${base64Placeholder}`

    // Add the dataUri to the media data (you can customize the field name)
    data.placeholder = dataUri
  } catch (error) {
    console.error('Error generating blur placeholder:', error)
  }

  return data
}
