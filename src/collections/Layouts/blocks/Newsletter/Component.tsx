import { NewsletterBlock as NewsletterBlockProps, Layout } from '@/payload-types'

export function NewsletterBlock({ block, layout }: { block: NewsletterBlockProps; layout: Layout }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-500 text-sm">Get the latest news delivered right to your inbox.</p>
      <form className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email address"
          className="border border-gray-300 px-3 py-2 text-sm"
        />
        <button className="bg-sky-700 border border-sky-700 text-white px-3 py-1 text-sm">
          Subscribe
        </button>
      </form>
    </div>
  )
}
