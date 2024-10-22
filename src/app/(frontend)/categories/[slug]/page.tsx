import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import Layout from '@/collections/Layouts/Component'
import { queryLayout } from '@/collections/Layouts/query'
import { getCachedDocument } from '@/utilities/getDocument'

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

  const category = await getCachedDocument('categories', slug, 3)()
  if (!category) return <PayloadRedirects url={'/categories/' + slug} />
  if (!category.layout) return <div>Category has no layout</div> // TODO: get latest posts

  const queryResult = await queryLayout({ layoutOrId: category.layout })
  if (!queryResult) return <div>Layout not found</div>

  return <Layout {...queryResult} />
}
