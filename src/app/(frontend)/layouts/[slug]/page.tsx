import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import Layout from '@/collections/Layouts/Component'
import { queryLayout } from '@/collections/Layouts/query'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const layouts = await payload.find({
    collection: 'layouts',
    draft: false,
    limit: 100,
    overrideAccess: false,
  })

  const params = layouts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function LayoutPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const queryResult = await queryLayout({ slug })
  if (!queryResult) return <PayloadRedirects url={'/layouts/' + slug} />

  return <Layout {...queryResult} />
}
