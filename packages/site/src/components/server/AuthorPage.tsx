import { getMediaByAuthor, getPostsByAuthor } from "@site/lib/cache";
import type { Author } from "@cms/payload-types";
import type { SC } from "@site/lib/types";
import { SmallHeader } from "./SmallHeader";
import { StandardContainer } from "@site/components/universal/StandardContainer";
import { AvatarImage } from "./AvatarImage";
import { IconBrandInstagram, IconBrandX, IconMail } from "../universal/Icons";
import RichText from "./richText/RichText";
import { PostItem } from "./PostItem";
import { MediaFigure } from "./MediaFigure";

type Props = {
  author: Author;
};

export const AuthorPage: SC<Props> = async ({ author }) => {
  const posts = await getPostsByAuthor(author.id, 1, 100);
  const media = await getMediaByAuthor(author.id, 0, 100);

  return (
    <div class="flex flex-col gap-8">
      <SmallHeader />
      <StandardContainer>
        <main class="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
          <div class="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
            <div class="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-6 justify-start w-full">
              <div class="flex gap-5 items-start md:items-center">
                <AvatarImage
                  media={author.avatar}
                  size="lg"
                  class="rounded-full relative top-2 md:top-0"
                  style={{
                    width: "70px",
                    height: "70px",
                  }}
                />
                <div class="flex flex-col gap-2">
                  <h1 class="text-3xl md:text-4xl leading-9 font-headline">
                    {author.name}
                  </h1>
                  <div class="flex flex-col gap-3 md:flex-row text-sm text-gray-800 underline underline-offset-2 decoration-gray-300">
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        target="_blank"
                        class="flex gap-1.5 items-center"
                      >
                        <IconMail size={20} class="text-black" />
                        {author.email}
                      </a>
                    )}
                    {author.twitter && (
                      <a
                        href={`https://twitter.com/${author.twitter}`}
                        target="_blank"
                        class="flex gap-1.5 items-center"
                      >
                        <IconBrandX size={20} class="text-black" />
                        {author.twitter}
                      </a>
                    )}
                    {author.instagram && (
                      <a
                        href={`https://instagram.com/${author.instagram}`}
                        target="_blank"
                        class="flex gap-1.5 items-center"
                      >
                        <IconBrandInstagram size={20} class="text-black" />
                        {author.instagram}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              {author.bio && (
                <RichText
                  content={author.bio}
                  font="serif"
                  size="lg"
                  black
                  class="pb-5 pt-10 border-t border-black"
                />
              )}
              {author.showPosts && posts.length > 0 ? (
                <>
                  <div class="flex justify-start py-2.5 border-y border-gray-600 w-full">
                    <h2 class="font-bold">Latest Articles</h2>
                  </div>
                  <div class="flex flex-col gap-5">
                    {posts.map((post) => (
                      
                      <div class="grid sm:grid-cols-[2fr_1fr] gap-6 pb-6 border-b">
                        {console.log(post)}
                        <PostItem post={post} size="xl" />
                        <MediaFigure
                          media={post.cover}
                          href={`/posts/${post.slug}`}
                          sizes="(min-width: 640px) 50vw, 100vw"
                          class="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <></>
              )}
              {author.showMedia && media.length > 0 && (
                <>
                  <div class="flex justify-start py-2.5 border-y border-gray-600 w-full">
                    <h2 class="font-bold">Latest Media</h2>
                  </div>
                  <div class="flex flex-col gap-5">
                    {media.map((media) => (
                      <MediaFigure
                        key={media.id}
                        media={media}
                        hideCredit
                        sizes="(min-width: 640px) 50vw, 100vw"
                        class="w-full"
                      />
                      // TODO: featured in
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </StandardContainer>
    </div>
  );
};
