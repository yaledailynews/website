import { MeiliSearch } from '@cms/components/MeiliSearch'
import { StandardContainer } from '@cms/components/StandardContainer'
import { SmallHeader } from '@cms/globals/Header/Component'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export default function SearchPage() {
  return (
    <div className="flex flex-col gap-8">
      <SmallHeader />
      <StandardContainer>
        <main className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
          <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
            <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-7 sm:gap-12 justify-start w-full">
              <MeiliSearch />
            </div>
          </div>
        </main>
      </StandardContainer>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for articles on The Yale Daily News',
}
