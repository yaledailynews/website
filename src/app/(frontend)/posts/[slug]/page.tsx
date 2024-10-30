import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import React from 'react'
import RichText from '@/components/RichText'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'

import type { Author, Post } from '@payload-types'

import Link from 'next/link'
import { IconMail, IconPlayerPlay } from '@tabler/icons-react'
import Image from 'next/image'
import icon from '@/assets/icon.png'
import { CMSLink } from '@/components/Link'
import { MediaFigure } from '@/components/MediaFigure'
import { CopyLink } from '@/components/CopyLink'
import { getDocById, getDocBySlug } from '@/utilities/cache'

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

const AuthorCard: React.FC<{ author: Author }> = async ({ author }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Link
          className="text-sm sm:text-base underline font-bold"
          key={author.name}
          href={`/authors/${author.slug}`}
        >
          {author.name}
        </Link>
        <a href={`mailto:${author.email}`}>
          <IconMail className="w-5 h-5 text-gray-500" />
        </a>
      </div>
      {author?.bio && <RichText font="sans" size="sm" content={author.bio} />}
    </div>
  )
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await getDocBySlug('posts', slug)()

  if (!post) return <PayloadRedirects url={url} />
  if (!post.authors) return <div>Post has no authors</div>
  if (!post.publishedAt) return <div>Post has no published date</div>

  const numAuthors = post.authors.length
  const resolvedAuthors = (
    await Promise.all(post.authors.map((author) => getDocById('authors', author)()))
  ).filter((author) => !!author)

  const formattedDate = format(post.publishedAt, "MMM. d, yyyy, h:mm a 'ET'", {
    locale: enUS,
  })

  return (
    <article className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
      <PayloadRedirects disableNotFound url={url} />
      <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
        <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-5 justify-start w-full">
          {post.title && (
            <h1 className="text-3xl md:text-4xl leading-9 font-headline">{post.title}</h1>
          )}
          {post.subhead && (
            <h2 className="text-lg md:text-xl font-serif font-medium text-gray-800">
              {post.subhead}
            </h2>
          )}
        </div>

        {post.cover && (
          <div
            className={`flex flex-col items-end ${`max-w-screen-sm `} pt-9 w-full`}
            // TODO: can adaptively have different image sizes here
          >
            <MediaFigure
              className="w-full h-auto"
              media={post.cover}
              priority
            />
          </div>
        )}
        <div className="max-w-screen-sm px-5 md:px-0 w-full flex flex-col pt-7 sm:pt-8 md:pt-9 lg:pt-10 gap-8 sm:gap-10 md:gap-12 lg:gap-14">
          <div className="flex flex-col gap-7 sm:gap-8">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex space-x-1 md:-space-x-4">
                    {resolvedAuthors.map((author, i) => (
                      <Image
                        key={author.name + i}
                        src={icon}
                        alt={`${author.name}'s avatar`}
                        className="size-12 rounded-full object-cover filter grayscale border-2 border-white relative z-30"
                        style={{ zIndex: numAuthors - i }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold text-sm">
                      By{' '}
                      {resolvedAuthors.map((author, i) => (
                        <React.Fragment key={i}>
                          <CMSLink
                            className="underline"
                            key={author.name + i}
                            reference={{
                              relationTo: 'authors',
                              value: author,
                            }}
                            appearance="inline"
                            label={author.name}
                            type="reference"
                          />
                          {i < numAuthors - 1 && (
                            <span>{i === numAuthors - 2 ? ' and ' : ', '}</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{formattedDate}</div>
                  </div>
                </div>
                <div className=" space-x-2 hidden md:flex">
                  {/* 
                  TODO: bookmark functionality?
                  <button className="p-2 bg-gray-100 rounded-full">
                    <IconBookmark size={20} />
                  </button> */}
                  <button
                    // onClick={handleListen}
                    className="p-2 bg-gray-100 rounded-full"
                    disabled={true}
                  >
                    <IconPlayerPlay size={20} />
                  </button>
                  <CopyLink />
                </div>
              </div>
            </div>
            <RichText content={post.content} font="serif" size="lg" black />
          </div>
          <hr />
          <div className="max-w-2xl flex items-start flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8">
            {resolvedAuthors.map((author, i) => (
              <AuthorCard key={i} author={author} />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
