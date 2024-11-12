import { getDocBySlug } from '@/utilities/cache'
import { Metadata } from 'next'
import PageComponent from '@/collections/Pages/Component'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise

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
