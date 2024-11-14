import { MediaFigure } from "@site/components/MediaFigure";
import type { TemplateProps } from ".";
import { ResolvedAuthors } from "@site/components/ResolvedAuthors";

export function SidebarTrio({ posts }: TemplateProps) {
  const [mainPost, secondaryPost, tertiaryPost] = posts;

  return (
    <>
      <article class="flex flex-col gap-3">
        <MediaFigure
          media={mainPost.cover}
          class="w-full"
          href={`/posts/${mainPost.slug}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 20vw"
        />
        <a
          href={`/posts/${mainPost.slug}`}
          class="hover:opacity-70 transition-opacity w-full"
        >
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1.5">
              <h1 class="text-xl md:text-lg font-headline">
                {mainPost.title}
              </h1>
              <p class="text-gray-600 md:text-sm font-serif">
                {mainPost.subhead}
              </p>
            </div>
            <div class="flex gap-3 items-center">
              {/* {mainPost.tag && (
                <span class="text-sky-700 bg-sky-200 px-2 py-0.5 text-xs self-start">
                  {mainPost.tag.name}
                </span>
              )} */}
              <p class="text-gray-500 text-xs">
                By <ResolvedAuthors post={mainPost} />
              </p>
            </div>
          </div>
        </a>
      </article>
      <article class="flex flex-col gap-3 border-t pt-5">
        <a
          href={`/posts/${secondaryPost.slug}`}
          class="hover:opacity-70 transition-opacity w-full"
        >
          <div class="flex flex-col gap-3">
            <h1 class="font-headline text-lg">{secondaryPost.title}</h1>
            <div class="flex gap-3 items-center">
              {/* {mainPost.tag && (
                <span class="text-sky-700 bg-sky-200 px-2 py-0.5 text-xs self-start">
                  {mainPost.tag.name}
                </span>
              )} */}
              <p class="text-gray-500 text-xs">
                By <ResolvedAuthors post={secondaryPost} />
              </p>
            </div>
          </div>
        </a>
      </article>
      <article class="grid grid-cols-2 gap-3 border-t pt-5">
        <a
          href={`/posts/${tertiaryPost.slug}`}
          class="hover:opacity-70 transition-opacity w-full"
        >
          <div class="flex flex-col gap-3">
            <h1 class="font-headline">{tertiaryPost.title}</h1>
            <div class="flex gap-3 items-center">
              <p class="text-gray-500 text-xs">
                By <ResolvedAuthors post={tertiaryPost} />
              </p>
            </div>
          </div>
        </a>
        <MediaFigure
          media={tertiaryPost.cover}
          href={`/posts/${tertiaryPost.slug}`}
          class="w-full aspect-[11/9] object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
      </article>
    </>
  );
}
