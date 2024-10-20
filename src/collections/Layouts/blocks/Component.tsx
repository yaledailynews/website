import { Layout, Post } from '@/payload-types'
import { TextBlock } from './Text/Component'
import { ArticlesBlock } from './Articles/Component'
import { PodcastsBlock } from './Podcasts/Component'
import { NewsletterBlock } from './Newsletter/Component'

export type LayoutBlocks = NonNullable<Layout['blocks']>
export type LayoutBlockType = LayoutBlocks[0]

export function LayoutBlock({
  block,
  layout,
  posts,
}: {
  block: LayoutBlockType
  layout: Layout
  posts?: Post[]
}) {
  if (block.blockType === 'layoutsText') {
    return <TextBlock block={block} layout={layout} />
  }
  if (block.blockType === 'layoutsArticles') {
    return <ArticlesBlock block={block} layout={layout} posts={posts} />
  }
  if (block.blockType === 'layoutsPodcasts') {
    return <PodcastsBlock block={block} layout={layout} />
  }
  if (block.blockType === 'layoutsNewsletter') {
    return <NewsletterBlock block={block} layout={layout} />
  }
  return <div>Unknown block type</div>
}
