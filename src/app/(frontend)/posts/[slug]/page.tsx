import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import React from 'react'
import type { Post } from '@payload-types'
import { getDocById, getDocBySlug } from '@/utilities/cache'
import { env } from '@/env'
import PostComponent from '@/collections/Posts/Component'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 100,
    overrideAccess: false,
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  if (!slug) return notFound()
  const post = await getDocBySlug('posts', slug)()
  if (!post) return notFound()

  return <PostComponent post={post} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Not Found' }
  const post = await getDocBySlug('posts', slug)()
  if (!post) return { title: 'Not Found' }
  const authors = (
    post.authors
      ? await Promise.all(post.authors.map((author) => getDocById('authors', author)()))
      : []
  ).map((author) => author.name)

  const section = (
    post.categories
      ? await Promise.all(post.categories.map((category) => getDocById('categories', category)()))
      : []
  )[0]?.title

  const cover = post.cover ? await getDocById('media', post.cover)() : undefined

  const coverSized = cover?.sizes?.xl ?? cover

  return {
    title: post.title,
    description: post.subhead,
    openGraph: {
      title: post.title,
      type: 'article',
      authors,
      description: post.subhead ?? undefined,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      countryName: 'United States',
      locale: 'en_US',
      section,
      siteName: 'The Yale Daily News',
      url: `${env.NEXT_PUBLIC_SERVER_URL}/posts/${post.slug}`,
      images:
        cover && coverSized && coverSized.filename && coverSized.width && coverSized.height
          ? [
              {
                url: `${env.NEXT_PUBLIC_S3_URL}/${coverSized.filename}`,
                width: coverSized.width,
                height: coverSized.height,
                alt: cover.alt,
              },
            ]
          : undefined,
    },
  }
}
