import { NewsletterBlock as NewsletterBlockProps, Layout } from '@/payload-types'

export async function NewsletterBlock({
  block,
  layout,
}: {
  block: NewsletterBlockProps
  layout: Layout
}) {
  return <div>Newsletter block will go here</div>
}
