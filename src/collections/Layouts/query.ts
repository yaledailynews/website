import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import configPromise from '@payload-config'
import { Layout, Post } from '@/payload-types'
import { getId } from '@/utilities/getId'
import { templateConstraints } from './blocks/Articles'

export const queryLayout = cache(
  async ({ layoutOrId, slug }: { slug?: string; layoutOrId?: number | Layout }) => {
    if (!slug && !layoutOrId) {
      return null
    }

    const { isEnabled: draft } = await draftMode()

    const payload = await getPayloadHMR({ config: configPromise })

    const result =
      typeof layoutOrId === 'object'
        ? { docs: [layoutOrId] }
        : await payload.find({
            collection: 'layouts',
            draft,
            limit: 1,
            overrideAccess: draft,
            where:
              typeof layoutOrId === 'number'
                ? {
                    layoutOrId: {
                      equals: layoutOrId,
                    },
                  }
                : {
                    slug: {
                      equals: slug,
                    },
                  },
          })

    if (!result.docs || result.docs.length === 0) {
      return null
    }

    const layout = result.docs[0]

    // resolve posts
    const resolvedPosts = new Map<number, Post[]>()
    if (layout.blocks) {
      const alreadyFound: number[] = []
      for (const block of layout.blocks || []) {
        if (block.blockType === 'layoutsArticles' && block.source === 'manual' && block.posts) {
          for (const post of block.posts) {
            alreadyFound.push(getId(post))
          }
        }
      }
      for (let i = 0; i < layout.blocks.length; i++) {
        const block = layout.blocks[i]
        if (
          block.blockType === 'layoutsArticles' &&
          block.source === 'latestFromCategory' &&
          block.category
        ) {
          const { auto } = templateConstraints[block.template]
          const posts = await payload.find({
            collection: 'posts',
            where: {
              categories: {
                contains: getId(block.category),
              },
              id: {
                not_in: alreadyFound,
              },
            },
            limit: auto,
          })
          resolvedPosts.set(i, posts.docs)
          for (const post of posts.docs) {
            alreadyFound.push(getId(post))
          }
        } else if (
          block.blockType === 'layoutsArticles' &&
          block.source === 'manual' &&
          block.posts
        ) {
          const posts = await Promise.all(
            block.posts.map((post) => {
              if (typeof post === 'number') {
                return payload.findByID({
                  collection: 'posts',
                  id: post,
                })
              }
              return post
            }),
          )
          resolvedPosts.set(i, posts)
        }
      }
    }

    return { layout, resolvedPosts }
  },
)

export type LayoutQuery = NonNullable<Awaited<ReturnType<typeof queryLayout>>>
