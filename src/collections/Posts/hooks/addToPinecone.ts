import { Post } from '@payload-types'
import { CollectionAfterChangeHook } from 'payload'

import { Pinecone } from '@pinecone-database/pinecone'
import { env } from '@/env'
import OpenAI from 'openai'

const openai = new OpenAI()

const pc = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
})
const search = pc.index('search')

export type PineconeMetadata = {
  collection: 'posts'
  id: number
  title: string
  subhead?: string
  slug?: string
}

export const addToPinecone: CollectionAfterChangeHook<Post> = async ({
  doc,
  req: { payload },
  collection,
}) => {
  if (doc._status === 'published') {
    const { slug, title, subhead, id } = doc

    payload.logger.info(`Adding post to Pinecone: ${slug}`)

    // Get text embedding
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: `${title} ${subhead}`,
      encoding_format: 'float',
    })

    const [data] = response.data

    const cover =
      typeof doc.cover === 'object'
        ? doc.cover?.id
        : typeof doc.cover === 'number'
          ? doc.cover
          : undefined

    if (collection.slug !== 'posts') {
      throw new Error('This hook should only be used on the posts collection')
    }

    const metadata: PineconeMetadata = {
      collection: collection.slug,
      id,
      title,
    }
    if (subhead) {
      metadata.subhead = subhead
    }
    if (slug) {
      metadata.slug = slug
    }

    // Add post to Pinecone
    await search.upsert([
      {
        id: `${collection.slug}-${doc.id.toString()}`,
        values: data.embedding,
        metadata,
      },
    ])
  }

  return doc
}
