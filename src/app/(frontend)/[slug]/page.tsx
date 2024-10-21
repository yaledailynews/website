import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import RichText from '@/components/RichText'
import { getCachedDocument } from '@/utilities/getDocument'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
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

  const page = await getCachedDocument('pages', slug, 2)()
  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
      <PayloadRedirects disableNotFound url={url} />
      <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
        <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-5 justify-start w-full">
          {page.title && (
            <h1 className="text-3xl md:text-4xl leading-9 font-headline">{page.title}</h1>
          )}
        </div>

        {/* {page.meta?.image && typeof page.meta.image !== 'string' && (
          <div
            className={`flex flex-col items-end ${`max-w-screen-sm `} pt-9`}
            // TODO: can adaptively have different image sizes here
          >
            <Media imgClassName="w-full h-auto" resource={page.meta.image} />
          </div>
        )} */}
        <div className="max-w-screen-sm px-5 md:px-0 w-full flex flex-col pt-7 sm:pt-8 md:pt-9 lg:pt-10 gap-8 sm:gap-10 md:gap-12 lg:gap-14">
          <RichText content={page.content} font="serif" size="lg" black />
        </div>
      </div>
    </article>
  )
}
