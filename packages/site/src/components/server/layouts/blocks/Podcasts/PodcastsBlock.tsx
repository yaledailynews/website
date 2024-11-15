import type {
  PodcastsBlock as PodcastsBlockProps,
  Layout,
} from "@cms/payload-types";
import type { SC } from "@site/lib/types";

type Props = {
  block: PodcastsBlockProps;
  layout: Layout;
};

// function PodcastEpisodeItem({
// 	title,
// 	duration,
// 	date,
// 	imageUrl,
// 	episodeUrl,
// }: PodcastEpisode) {
// 	return (
// 		<div class="grid grid-cols-[100px_1fr] gap-4 items-start">
// 			<div class="relative">
// 				<a href={episodeUrl} class="">
// 					<img
// 						src={imageUrl}
// 						alt={title}
// 						class="w-full"
// 						width={640}
// 						height={640}
// 					/>
// 					<div class="absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-center items-center gap-2">
// 						<IconPlayerPlayFilled class="w-12 h-12 text-white shadow-lg" />
// 					</div>
// 				</a>
// 			</div>
// 			<div class="flex flex-col gap-2">
// 				<Link
// 					href={episodeUrl}
// 					class="font-headline hover:opacity-70 transition-opacity"
// 				>
// 					{title}
// 				</Link>
// 				<div class="flex gap-2 items-center">
// 					<p class="text-gray-500 text-xs">{duration}</p>
// 					<p class="text-gray-300 text-xs">|</p>
// 					<p class="text-gray-500 text-xs">{date}</p>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

export const PodcastsBlock: SC<Props> = ({}) => {
  return <div>Podcasts block will go here</div>;
};
