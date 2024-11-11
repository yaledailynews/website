import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { LayoutComponent } from '@/collections/Layouts/Component'
import { queryLayout } from '@/collections/Layouts/query'
import { getDocBySlug, getPostsByCategory } from '@/utilities/cache'
import { Metadata } from 'next'
import { SmallHeader } from '@/globals/Header/Component'
import { StandardContainer } from '@/components/StandardContainer'
import { PostItem } from '@/components/PostItem'
import { MediaFigure } from '@/components/MediaFigure'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const categories = await payload.find({
    collection: 'categories',
    draft: false,
    limit: 100,
    overrideAccess: false,
  })

  const params = categories.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise

  const category = await getDocBySlug('categories', slug)()
  if (!category) return notFound()
  if (!category.layout) {
    const posts = await getPostsByCategory(category.id, 3, 100)()
    return (
      <div className="flex flex-col gap-8">
        <SmallHeader />
        <StandardContainer>
          <main className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
            <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
              <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-6 justify-start w-full">
                <h1 className="text-3xl md:text-4xl leading-9 font-headline w-full">
                  {category.title}
                </h1>
                <div className="flex justify-start py-2.5 border-y border-gray-600 w-full">
                  <h2 className="font-bold">Latest Articles</h2>
                </div>
                <div className="flex flex-col gap-5">
                  {posts.map((post) => (
                    <div key={post.id} className="grid sm:grid-cols-[2fr_1fr] gap-6 pb-6 border-b">
                      <PostItem post={post} size="xl" />
                      <MediaFigure
                        media={post.cover}
                        href={`/posts/${post.slug}`}
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="w-full"
                      />
                    </div>
                  ))}
                  {posts.length === 0 && <p className="text-gray-500">No posts found</p>}
                  {/* TODO: pagination */}
                </div>
              </div>
            </div>
          </main>
        </StandardContainer>
      </div>
    )
  }

  const queryResult = await queryLayout(category.layout)
  if (!queryResult) return <div>Layout not found</div>

  return (
    <div className="flex flex-col gap-8">
      <SmallHeader />
      <StandardContainer>
        <h1 className="text-3xl md:text-4xl leading-9 font-headline w-full border-b py-4">
          {category.title}
        </h1>
        <LayoutComponent {...queryResult} />
      </StandardContainer>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Not Found' }
  const category = await getDocBySlug('categories', slug)()
  if (!category) return { title: 'Not Found' }
  return {
    title: category.title,
  }
}
