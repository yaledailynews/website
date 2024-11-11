import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { getDocBySlug } from '@/utilities/cache'
import { Metadata } from 'next'
import PageComponent from '@/collections/Pages/Component'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 100,
    overrideAccess: false,
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  const page = await getDocBySlug('pages', slug)()
  if (!page) {
    return notFound()
  }

  return <PageComponent page={page} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Not Found' }
  const page = await getDocBySlug('pages', slug)()
  if (!page) return { title: 'Not Found' }
  return {
    title: page.title,
  }
}
