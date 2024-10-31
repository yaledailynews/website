// import type { CollectionBeforeChangeHook } from 'payload'
// import { Media } from '@payload-types'
// import { encode } from 'blurhash'
// import sharp from 'sharp'

// /**
//  * Generate a Blurhash string from an image buffer.
//  * @param imageBuffer - The buffer of the image.
//  * @returns - The Blurhash string.
//  */
// async function getBlurhashFromBuffer(imageBuffer: Buffer): Promise<string> {
//   // Process the image buffer with sharp, resizing and extracting pixel data
//   const { data, info } = await sharp(imageBuffer)
//     .raw()
//     .ensureAlpha()
//     .resize(32, 32, { fit: 'inside' })
//     .toBuffer({ resolveWithObject: true })

//   // Encode to Blurhash
//   return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
// }

// export const generateBlur: CollectionBeforeChangeHook<Media> = async ({
//   data,
//   req: { payload, file },
// }) => {
//   if (!data.mimeType?.startsWith('image/')) {
//     return data
//   }
//   if (file == null || !('data' in file)) {
//     return data
//   }
//   const fileData = file.data
//   if (!Buffer.isBuffer(fileData)) {
//     return data
//   }

//   try {
//     data.blurhash = await getBlurhashFromBuffer(fileData)
//   } catch (error) {
//     payload.logger.error('Failed to generate Blurhash', error)
//   }

//   return data
// }
