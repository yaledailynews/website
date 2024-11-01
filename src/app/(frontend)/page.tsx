import Layout from '@/collections/Layouts/Component'
import { queryLayout } from '@/collections/Layouts/query'
import { getGlobal } from '@/utilities/cache'
import { Metadata } from 'next'

export default async function HomePage() {
  const settings = await getGlobal('settings')()
  const queryResult = await queryLayout(settings?.homeLayout)

  if (!queryResult) return <div>Home layout not found</div>

  return <Layout {...queryResult} />
}

export const metadata: Metadata = {
  description: "The Yale Daily News is the nation's oldest college daily newspaper.",
}
