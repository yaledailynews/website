import { Author, Category, Page, Post } from '@payload-types'
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
  collection: 'posts' | 'pages' | 'authors' | 'categories'
  id: number
  slug?: string
}

export const addToPinecone: CollectionAfterChangeHook<Post | Page | Author | Category> = async ({
  doc,
  req: { payload },
  collection,
}) => {
  if (collection.slug !== 'posts' && collection.slug !== 'pages' && collection.slug !== 'authors' && collection.slug !== 'categories') {
    throw new Error('This hook only supports the "posts" and "pages" collections')
  }

  if (
    collection.slug === 'authors' ||
    collection.slug === 'categories' ||
    // @ts-expect-error
    doc._status === 'published'
  ) {
    const { id, slug } = doc

    let input: string | undefined
    if (collection.slug === 'posts') {
      const { title, subhead } = doc as Post
      input = `${title} ${subhead}`
    } else if (collection.slug === 'pages') {
      const { title } = doc as Page
      input = title
    } else if (collection.slug === 'authors') {
      const { name } = doc as Author
      input = name
    } else if (collection.slug === 'categories') {
      const { title } = doc as Category
      input = title
    }

    if (!input) {
      throw new Error('Could not generate input for Pinecone')
    }

    // Get text embedding
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input,
      encoding_format: 'float',
    })

    const [data] = response.data

    const metadata: PineconeMetadata = {
      collection: collection.slug,
      id,
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
