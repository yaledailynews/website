import { LayoutComponent } from '@/collections/Layouts/Component'
import { queryLayout } from '@/collections/Layouts/query'
import { StandardContainer } from '@/components/StandardContainer'
import { HomeHeader } from '@/globals/Header/Component'
import { getGlobal } from '@/utilities/cache'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = await getGlobal('settings')()
  const queryResult = await queryLayout(settings?.homeLayout)

  if (!queryResult) return <div>Home layout not found</div>

  return (
    <StandardContainer>
      <HomeHeader />
      <LayoutComponent {...queryResult} />
    </StandardContainer>
  )
}

export const metadata: Metadata = {
  description: "The Yale Daily News is the nation's oldest college daily newspaper.",
}