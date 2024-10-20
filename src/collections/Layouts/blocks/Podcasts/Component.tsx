import { PodcastsBlock as PodcastsBlockProps, Layout } from '@/payload-types'

// function PodcastEpisodeItem({
// 	title,
// 	duration,
// 	date,
// 	imageUrl,
// 	episodeUrl,
// }: PodcastEpisode) {
// 	return (
// 		<div className="grid grid-cols-[100px_1fr] gap-4 items-start">
// 			<div className="relative">
// 				<a href={episodeUrl} className="">
// 					<img
// 						src={imageUrl}
// 						alt={title}
// 						className="w-full"
// 						width={640}
// 						height={640}
// 					/>
// 					<div className="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-center items-center gap-2">
// 						<IconPlayerPlayFilled className="w-12 h-12 text-white shadow-lg" />
// 					</div>
// 				</a>
// 			</div>
// 			<div className="flex flex-col gap-2">
// 				<Link
// 					href={episodeUrl}
// 					className="font-headline hover:opacity-70 transition-opacity"
// 				>
// 					{title}
// 				</Link>
// 				<div className="flex gap-2 items-center">
// 					<p className="text-gray-500 text-xs">{duration}</p>
// 					<p className="text-gray-300 text-xs">|</p>
// 					<p className="text-gray-500 text-xs">{date}</p>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

export async function PodcastsBlock({
  block,
  layout,
}: {
  block: PodcastsBlockProps
  layout: Layout
}) {
  return <div>Podcasts block will go here</div>
}
