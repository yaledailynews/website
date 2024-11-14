import { LayoutComponent } from '@cms/collections/Layouts/Component'
import { queryLayout } from '@cms/collections/Layouts/query'
import { StandardContainer } from '@cms/components/StandardContainer'
import { HomeHeader } from '@cms/globals/Header/Component'
import { getGlobal } from '@cms/utilities/cache'
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
