import { AvatarImage } from '@cms/components/AvatarImage'
import { CopyLink } from '@cms/components/CopyLink'
import { CMSLink } from '@cms/components/Link'
import { MediaFigure } from '@cms/components/MediaFigure'
import RichText from '@cms/components/RichText'
import { SmallHeader } from '@cms/globals/Header/Component'
import { getDocById } from '@cms/utilities/cache'
import { cn } from '@cms/utilities/cn'
import { Author, Post } from '@cms/payload-types'
import { IconMail } from '@tabler/icons-react'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import icon from '@cms/assets/icon.png'
import { notFound } from 'next/navigation'

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

export default async function PostComponent({ post, draft }: { post: Post; draft?: boolean }) {
  if (!post.authors && !draft) return <div>Post has no authors</div>
  if (!post.publishedAt && !draft) return notFound()

  const numAuthors = post.authors?.length || 0
  const resolvedAuthors = post.authors
    ? (await Promise.all(post.authors.map((author) => getDocById('authors', author)()))).filter(
        (author) => !!author,
      )
    : []

  const formattedDate = post.publishedAt
    ? format(post.publishedAt, "MMM. d, yyyy, h:mm a 'ET'", {
        locale: enUS,
      })
    : 'Unpublished'

  return (
    <div
      className={cn('flex flex-col gap-8', {
        'sm:gap-0': post.heroStyle === 'full',
      })}
    >
      <SmallHeader />
      <article className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
        <div
          className={cn('flex flex-col items-center w-full', {
            'py-4 sm:py-6 md:py-8 lg:py-9': post.heroStyle === 'standard',
          })}
        >
          <div
            className={cn(
              'max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-5 justify-start w-full',
              {
                'sm:hidden': post.heroStyle === 'full',
              },
            )}
          >
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
              className={cn('flex flex-col items-end max-w-screen-sm pt-9 w-full', {
                'sm:hidden': post.heroStyle === 'full',
              })}
            >
              <MediaFigure
                className="w-full h-auto"
                media={post.cover}
                fullBleed="sm"
                sizes="(max-width: 640px) 100vw, 640px"
                priority
              />
            </div>
          )}
          {post.cover && post.heroStyle === 'full' && (
            <MediaFigure
              className="h-auto w-full"
              figureClassName="hidden sm:flex"
              imgContainerClassName="w-full overflow-hidden flex justify-center items-center relative max-h-[calc(100vh_-_56px)]"
              media={post.cover}
              fullBleed="lg"
              sizes="100vw"
              overlay={
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 sm:px-6 md:px-8 lg:px-10 pb-4 sm:pb-6 md:pb-8 lg:pb-10 pt-6 sm:pt-12 md:pt-20 lg:pt-28 flex flex-col gap-2 sm:gap-3 md:gap-4">
                  {post.title && (
                    <h1 className="text-2xl md:text-3xl lg:text-4xl leading-9 font-headline text-white max-w-3xl">
                      {post.title}
                    </h1>
                  )}
                  {post.subhead && (
                    <h2 className="md:text-lg lg:text-xl font-serif font-medium text-gray-200 max-w-3xl">
                      {post.subhead}
                    </h2>
                  )}
                </div>
              }
              priority
            />
          )}

          <div className="max-w-screen-sm px-5 md:px-0 w-full flex flex-col pt-7 sm:pt-8 md:pt-9 lg:pt-10 gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            <div className="flex flex-col gap-7 sm:gap-8">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    {resolvedAuthors.length > 0 && (
                      <div className="flex space-x-1 md:-space-x-4">
                        {resolvedAuthors.map((author, i) =>
                          author.avatar ? (
                            <AvatarImage
                              key={author.name + i}
                              media={author.avatar}
                              size="sm"
                              className="size-12 rounded-full object-cover border-2 border-white relative z-30"
                              style={{ zIndex: numAuthors - i }}
                            />
                          ) : (
                            <Image
                              key={author.name + i}
                              src={icon}
                              alt={`${author.name}'s avatar`}
                              className="size-12 rounded-full object-cover border-2 border-white relative z-30"
                              style={{ zIndex: numAuthors - i }}
                            />
                          ),
                        )}
                      </div>
                    )}
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
                        {resolvedAuthors.length === 0 && (
                          <span className='text-red-600 bg-red-100 px-2 py-0.5 rounded'>add at least one author</span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{formattedDate}</div>
                    </div>
                  </div>
                  <div className=" space-x-2 hidden md:flex">
                    {/* <button
                      // onClick={handleListen}
                      className="p-2 bg-gray-100 rounded-full"
                      disabled={true}
                    >
                      <IconPlayerPlay size={20} />
                    </button> */}
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
    </div>
  )
}
