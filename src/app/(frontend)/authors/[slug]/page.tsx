import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { IconMail } from '@tabler/icons-react'
import { PostItem } from '@/components/PostItem'
import { getDocBySlug, getPostsByAuthor } from '@/utilities/cache'

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
  if (!author) return <PayloadRedirects url={'/authors/' + slug} />

  const posts = await getPostsByAuthor(author.id, 0, 100)()

  return (
    <main className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
      <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
        <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-5 justify-start w-full">
          <h1 className="text-3xl md:text-4xl leading-9 font-headline">{author.name}</h1>
          {author.email && (
            <a href={`mailto:${author.email}`} className="flex gap-2 items-center ">
              <IconMail size={20} />
              {author.email}
            </a>
          )}
          {author.bio && <RichText content={author.bio} font="serif" size="lg" black />}
          <div className="flex justify-start py-3 border-y border-gray-600 w-full">
            <h2 className="font-bold">Latest</h2>
          </div>
          <div>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} size='lg' />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
