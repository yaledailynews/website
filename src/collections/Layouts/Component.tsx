import { cn } from '@/utilities/cn'
import { Layout as LayoutType, Post } from '@payload-types'
import Link from 'next/link'
import { LayoutQuery } from './query'
import { LayoutBlock, LayoutBlockType } from './blocks/Component'
import { getDocById } from '@/utilities/cache'

export default async function Layout({ layout, resolvedPosts }: LayoutQuery) {
  if (!layout.blocks) return <div>Layout has no blocks</div>

  const hideSidebar = layout.template !== 'standard'

  return (
    <>
      <main
        className={
          'flex-col gap-4 px-4 md:px-0 hidden md:flex' + (hideSidebar ? ' max-w-3xl mx-auto' : '')
        }
      >
        <BlocksForPosition layout={layout} position="fullTop" resolvedPosts={resolvedPosts} />
        <div className={'grid grid-cols-1 gap-4' + (!hideSidebar ? ' md:grid-cols-[5fr_2fr]' : '')}>
          <div
            className={
              'flex flex-col gap-5' +
              (!hideSidebar ? ' md:border-r md:border-r-gray-400 md:pr-4' : '')
            }
          >
            <BlocksForPosition layout={layout} position="main" resolvedPosts={resolvedPosts} />
          </div>
          {!hideSidebar && (
            <div className="flex flex-col gap-5 border-t border-t-gray-800 pt-5 mt-5 md:border-t-0 md:pt-0 md:mt-0">
              <BlocksForPosition layout={layout} position="sidebar" resolvedPosts={resolvedPosts} />
            </div>
          )}
        </div>
        <BlocksForPosition layout={layout} position="fullBottom" resolvedPosts={resolvedPosts} />
      </main>
      <main className="flex flex-col gap-4 px-4 md:px-0 md:hidden">
        <BlocksForPosition layout={layout} resolvedPosts={resolvedPosts} />
      </main>
    </>
  )
}

function BlocksForPosition({
  position,
  layout,
  resolvedPosts,
}: {
  layout: LayoutType
  resolvedPosts: Map<number, Post[]>
  position?: LayoutBlockType['desktopPosition']
}) {
  let displayIndex = 0

  if (!layout.blocks) return null

  return (
    <>
      {layout.blocks.map(async (block, index) => {
        if (position && block.desktopPosition !== position) return null

        const hideBorder = displayIndex === 0 && block.desktopPosition === 'main'
        const hideBorderMd = displayIndex === 0 && block.desktopPosition === 'sidebar'

        displayIndex++

        const posts = resolvedPosts.get(index)

        return (
          <div
            key={block.id}
            className={cn('grid gap-5 pb-3', {
              'border-t mt-2': !hideBorder,
              'md:border-t-0 md:mt-0 md:pt-0': hideBorderMd,
              'pt-2': !hideBorder && block.blockName,
              'pt-5': !hideBorder && !block.blockName,
              'md:pt-0': hideBorderMd && block.blockName,
              'border-t-gray-700': block.topDivider === 'dark' || block.desktopPosition !== 'main',
            })}
          >
            {block.blockName &&
              block.blockType === 'layoutsArticles' &&
              (block.category ? (
                <Link
                  href={`/categories/${(await getDocById('categories', block.category)()).slug}`}
                >
                  <h2 className={cn('text-sm font-bold')}>{block.blockName}</h2>
                </Link>
              ) : (
                <h2 className={cn('text-sm font-bold')}>{block.blockName}</h2>
              ))}
            <div className="flex flex-col gap-5">
              <LayoutBlock block={block} layout={layout} posts={posts} />
            </div>
          </div>
        )
      })}
    </>
  )
}
