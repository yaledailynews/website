import { NodeTypes, serializeLexical } from '@/components/RichText/serialize'
import { env } from '@/env'
import { Post } from '@payload-types'
import { CollectionAfterChangeHook } from 'payload'
import React from 'react'
import { MeiliSearch } from 'meilisearch'

function extractTextFromElement(element: React.ReactNode): string {
  if (typeof element === 'string') {
    return element
  }
  if (Array.isArray(element)) {
    return element.map(extractTextFromElement).join('')
  }
  if (React.isValidElement<{ children: React.ReactNode }>(element) && element.props.children) {
    return extractTextFromElement(element.props.children)
  }
  return ' '
}

const client = new MeiliSearch({
  host: env.MEILI_URL,
  apiKey: env.MEILI_ADMIN_KEY,
})

export const addToMeili: CollectionAfterChangeHook<Post> = async ({
  doc,
  req: { payload },
  collection,
}) => {
  const { content, title, id, authors, categories, slug, subhead, publishedAt, cover } = doc

  if (collection.slug !== 'posts') {
    throw new Error('This hook only supports the "posts" collection')
  }

  if (doc._status === 'published') {
    const serializedContent = extractTextFromElement(
      serializeLexical({ nodes: content.root.children as NodeTypes[] }),
    ).slice(0, 5000)

    const authorsArray = (
      authors
        ? await Promise.all(
            authors.map(async (author) => {
              if (typeof author === 'number') {
                const resolvedAuthor = await payload.findByID({
                  collection: 'authors',
                  id: author,
                  draft: false,
                  depth: 0,
                })
                return resolvedAuthor?.name
              } else {
                return author.name
              }
            }),
          )
        : []
    ).filter((name) => typeof name === 'string')

    const categoriesArray = (
      categories
        ? await Promise.all(
            categories.map(async (category) => {
              if (typeof category === 'number') {
                const resolvedCategory = await payload.findByID({
                  collection: 'categories',
                  id: category,
                  draft: false,
                  depth: 0,
                })
                return resolvedCategory?.title
              } else {
                return category.title
              }
            }),
          )
        : []
    ).filter((title) => typeof title === 'string')

    const resolvedCover =
      typeof cover === 'number' ? await payload.findByID({ collection: 'media', id: cover }) : cover
    const coverUrl = resolvedCover?.sizes?.lg?.filename ?? undefined

    const index = client.index(env.NEXT_PUBLIC_MEILI_SEARCH_INDEX)

    await index.addDocuments([
      {
        id,
        title,
        subhead,
        slug,
        content: serializedContent,
        authors: authorsArray,
        categories: categoriesArray,
        publishedAt: publishedAt ? new Date(publishedAt).getTime() : undefined,
        coverUrl,
      },
    ])
  }

  return doc
}