import { getDocById } from '@/utilities/cache'
import { Post } from '@payload-types'

export async function ResolvedAuthors({ post }: { post: Post }) {
  if (!post.authors) return null
  const resolvedAuthors = await Promise.all(
    post.authors.map((author) => getDocById('authors', author)()),
  )
  return <span>{resolvedAuthors.map((author) => author.name).join(', ')}</span>
}
