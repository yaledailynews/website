import { LayoutComponent } from '@/collections/Layouts/Component'
import { queryLayout } from '@/collections/Layouts/query'
import { Metadata } from 'next'
import { getDocBySlug } from '@/utilities/cache'
import { SmallHeader } from '@/globals/Header/Component'
import { StandardContainer } from '@/components/StandardContainer'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function LayoutPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const queryResult = await queryLayout(slug)
  if (!queryResult) return notFound()

  return (
    <div className="flex flex-col gap-16">
      <SmallHeader />
      <StandardContainer>
        <LayoutComponent {...queryResult} />
      </StandardContainer>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Not Found' }
  const layout = await getDocBySlug('layouts', slug)()
  if (!layout) return { title: 'Not Found' }
  return {
    title: layout.title,
  }
}
