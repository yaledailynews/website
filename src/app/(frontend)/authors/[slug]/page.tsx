import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { getCachedDocument } from '@/utilities/getDocument'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const categories = await payload.find({
    collection: 'categories',
    draft: false,
    limit: 1000,
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

  const author = await getCachedDocument('authors', slug, 2)()

  if (!author) return <PayloadRedirects url={'/authors/' + slug} />

  return <div>{author.name}</div>
}
