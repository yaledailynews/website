// TODO: pagination

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import RichText from '@/components/RichText'
import { IconBrandInstagram, IconBrandX, IconMail } from '@tabler/icons-react'
import { PostItem } from '@/components/PostItem'
import { getDocBySlug, getMediaByAuthor, getPostsByAuthor } from '@/utilities/cache'
import { MediaFigure } from '@/components/MediaFigure'
import { AvatarImage } from '@/components/AvatarImage'
import { Metadata } from 'next'
import { SmallHeader } from '@/globals/Header/Small'
import { StandardContainer } from '@/components/StandardContainer'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const authors = await payload.find({
    collection: 'authors',
    draft: false,
    limit: 100,
    overrideAccess: false,
  })

  const params = authors.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function AuthorPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise

  const author = await getDocBySlug('authors', slug)()
  if (!author) return notFound()

  const posts = await getPostsByAuthor(author.id, 1, 100)()
  const media = await getMediaByAuthor(author.id, 0, 100)()

  return (
    <div className="flex flex-col gap-8">
      <SmallHeader />
      <StandardContainer>
        <main className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
          <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
            <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-6 justify-start w-full">
              <div className="flex gap-5 items-start md:items-center">
                <AvatarImage
                  media={author.avatar}
                  alt={author.name}
                  size="lg"
                  className="rounded-full relative top-2 md:top-0"
                  width={70}
                />
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl md:text-4xl leading-9 font-headline">{author.name}</h1>
                  <div className="flex flex-col gap-3 md:flex-row text-sm text-gray-800 underline underline-offset-2 decoration-gray-300">
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        target="_blank"
                        className="flex gap-1.5 items-center"
                      >
                        <IconMail size={20} className="text-black" />
                        {author.email}
                      </a>
                    )}
                    {author.twitter && (
                      <a
                        href={`https://twitter.com/${author.twitter}`}
                        target="_blank"
                        className="flex gap-1.5 items-center"
                      >
                        <IconBrandX size={20} className="text-black" />
                        {author.twitter}
                      </a>
                    )}
                    {author.instagram && (
                      <a
                        href={`https://instagram.com/${author.instagram}`}
                        target="_blank"
                        className="flex gap-1.5 items-center"
                      >
                        <IconBrandInstagram size={20} className="text-black" />
                        {author.instagram}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              {author.bio && (
                <RichText
                  content={author.bio}
                  font="serif"
                  size="lg"
                  black
                  className="pb-5 pt-10 border-t border-black"
                />
              )}
              {author.showPosts && posts.length > 0 && (
                <>
                  <div className="flex justify-start py-2.5 border-y border-gray-600 w-full">
                    <h2 className="font-bold">Latest Articles</h2>
                  </div>
                  <div className="flex flex-col gap-5">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="grid sm:grid-cols-[2fr_1fr] gap-6 pb-6 border-b"
                      >
                        <PostItem post={post} size="xl" />
                        <MediaFigure
                          media={post.cover}
                          href={`/posts/${post.slug}`}
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="w-full"
                        />
                      </div>
                    ))}
                    {/* TODO: pagination */}
                  </div>
                </>
              )}
              {author.showMedia && media.length > 0 && (
                <>
                  <div className="flex justify-start py-2.5 border-y border-gray-600 w-full">
                    <h2 className="font-bold">Latest Media</h2>
                  </div>
                  <div className="flex flex-col gap-5">
                    {media.map((media) => (
                      <MediaFigure
                        key={media.id}
                        media={media}
                        hideCredit
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="w-full"
                      />
                      // TODO: featured in
                    ))}
                    {/* TODO: pagination */}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </StandardContainer>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Not Found' }
  const author = await getDocBySlug('authors', slug)()
  if (!author) return { title: 'Not Found' }
  return {
    title: author.name,
  }
}
