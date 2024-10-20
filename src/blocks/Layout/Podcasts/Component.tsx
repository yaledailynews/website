import { PodcastsBlock as PodcastsBlockProps, Layout } from '@/payload-types'

export async function PodcastsBlock({ block, layout }: {
  block: PodcastsBlockProps
  layout: Layout
}) {
  return (
    <div>
      Podcasts block will go here
    </div>
  );
}
