import RichText from '@/components/RichText'
import { SmallHeader } from '@/globals/Header/Component'
import { Page } from '@payload-types'

export default function PageComponent({ page }: { page: Page }) {
  return (
    <div className="flex flex-col gap-8">
      <SmallHeader />
      <article className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
        <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
          <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-5 justify-start w-full">
            {page.title && (
              <h1 className="text-3xl md:text-4xl leading-9 font-headline">{page.title}</h1>
            )}
          </div>
          <div className="max-w-screen-sm px-5 md:px-0 w-full flex flex-col pt-7 sm:pt-8 md:pt-9 lg:pt-10 gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            <RichText content={page.content} font="serif" size="lg" black />
          </div>
        </div>
      </article>
    </div>
  )
}
