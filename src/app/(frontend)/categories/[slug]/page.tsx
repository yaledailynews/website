import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import Layout from '@/collections/Layouts/Component'
import { queryLayout } from '@/collections/Layouts/query'
import { getDocBySlug } from '@/utilities/cache'
import { Metadata } from 'next'
import { SmallHeader } from '@/globals/Header/Small'

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
  if (!category) return <PayloadRedirects url={'/categories/' + slug} />
  if (!category.layout) return <div>Category has no layout</div> // TODO: get latest posts

  const queryResult = await queryLayout(category.layout)
  if (!queryResult) return <div>Layout not found</div>

  return (
    <div className="flex flex-col gap-8">
      <SmallHeader />
      <Layout {...queryResult} />
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
