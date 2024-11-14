import { ArticlesBlock as ArticlesBlockProps, Layout, Post } from '@cms/payload-types'
import { templates } from './templates'

export async function ArticlesBlock({
  posts,
  block,
  layout,
}: {
  block: ArticlesBlockProps
  layout: Layout
  posts?: Post[]
}) {
  if (!posts) {
    return <div>No articles</div>
  }

  const TemplateComponent = templates[block.template]

  return <TemplateComponent block={block} posts={posts} />
}
