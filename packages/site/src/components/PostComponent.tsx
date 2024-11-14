import type { FC } from "hono/jsx";
import type { Author, Post } from "@cms/payload-types";
import { IconMail } from "@site/universal/Icons";
import RichText from "./richText/RichText";
import { getDocById } from "@site/lib/cache";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@site/lib/utils";
import { SmallHeader } from "./SmallHeader";
import { MediaFigure } from "./MediaFigure";
import { CMSLink } from "./CMSLink";
import { AvatarImage } from "./AvatarImage";
import { CopyLinkIsland } from "@site/client/CopyLink";

const AuthorCard: FC<{ author: Author }> = async ({ author }) => {
  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <a
          class="text-sm sm:text-base underline font-bold"
          href={`/authors/${author.slug}`}
        >
          {author.name}
        </a>
        <a href={`mailto:${author.email}`}>
          <IconMail class="w-5 h-5 text-gray-500" />
        </a>
      </div>
      {author?.bio && <RichText font="sans" size="sm" content={author.bio} />}
    </div>
  );
};

export async function PostComponent({
  post,
  draft,
}: {
  post: Post;
  draft?: boolean;
}) {
  if (!post.authors && !draft) return <div>Post has no authors</div>;
  if (!post.publishedAt && !draft) return <div>Post is unpublished</div>;

  const numAuthors = post.authors?.length || 0;
  const resolvedAuthors = post.authors
    ? (
        await Promise.all(
          post.authors.map((author) => getDocById("authors", author)),
        )
      ).filter((author) => !!author)
    : [];

  const formattedDate = post.publishedAt
    ? format(post.publishedAt, "MMM. d, yyyy, h:mm a 'ET'", {
        locale: enUS,
      })
    : "Unpublished";

  return (
    <div
      class={cn("flex flex-col gap-8", {
        "sm:gap-0": post.heroStyle === "full",
      })}
    >
      <SmallHeader />
      <article class="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
        <div
          class={cn("flex flex-col items-center w-full", {
            "py-4 sm:py-6 md:py-8 lg:py-9": post.heroStyle === "standard",
          })}
        >
          <div
            class={cn(
              "max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-5 justify-start w-full",
              {
                "sm:hidden": post.heroStyle === "full",
              },
            )}
          >
            {post.title && (
              <h1 class="text-3xl md:text-4xl leading-9 font-headline">
                {post.title}
              </h1>
            )}
            {post.subhead && (
              <h2 class="text-lg md:text-xl font-serif font-medium text-gray-800">
                {post.subhead}
              </h2>
            )}
          </div>

          {post.cover && (
            <div
              class={cn("flex flex-col items-end max-w-screen-sm pt-9 w-full", {
                "sm:hidden": post.heroStyle === "full",
              })}
            >
              <MediaFigure
                class="w-full h-auto"
                media={post.cover}
                fullBleed="sm"
                sizes="(max-width: 640px) 100vw, 640px"
                priority
              />
            </div>
          )}
          {post.cover && post.heroStyle === "full" && (
            <MediaFigure
              class="h-auto w-full"
              figureClass="hidden sm:flex"
              imgContainerClass="w-full overflow-hidden flex justify-center items-center relative max-h-[calc(100vh_-_56px)]"
              media={post.cover}
              fullBleed="lg"
              sizes="100vw"
              overlay={
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 sm:px-6 md:px-8 lg:px-10 pb-4 sm:pb-6 md:pb-8 lg:pb-10 pt-6 sm:pt-12 md:pt-20 lg:pt-28 flex flex-col gap-2 sm:gap-3 md:gap-4">
                  {post.title && (
                    <h1 class="text-2xl md:text-3xl lg:text-4xl leading-9 font-headline text-white max-w-3xl">
                      {post.title}
                    </h1>
                  )}
                  {post.subhead && (
                    <h2 class="md:text-lg lg:text-xl font-serif font-medium text-gray-200 max-w-3xl">
                      {post.subhead}
                    </h2>
                  )}
                </div>
              }
              priority
            />
          )}

          <div class="max-w-screen-sm px-5 md:px-0 w-full flex flex-col pt-7 sm:pt-8 md:pt-9 lg:pt-10 gap-8 sm:gap-10 md:gap-12 lg:gap-14">
            <div class="flex flex-col gap-7 sm:gap-8">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex flex-col md:flex-row md:items-center gap-3">
                    {resolvedAuthors.length > 0 && (
                      <div class="flex space-x-1 md:-space-x-4">
                        {resolvedAuthors.map((author, i) =>
                          author.avatar ? (
                            <AvatarImage
                              media={author.avatar}
                              size="sm"
                              class="size-12 rounded-full object-cover border-2 border-white relative z-30"
                              style={{ zIndex: numAuthors - i }}
                            />
                          ) : (
                            <img
                              src="/icon.png"
                              width={417}
                              height={417}
                              alt={`${author.name}'s avatar`}
                              class="size-12 rounded-full object-cover border-2 border-white relative z-30"
                              style={{ zIndex: numAuthors - i }}
                            />
                          ),
                        )}
                      </div>
                    )}
                    <div class="flex flex-col gap-1">
                      <div class="font-semibold text-sm">
                        By{" "}
                        {resolvedAuthors.map((author, i) => (
                          <>
                            <CMSLink
                              class="underline"
                              reference={{
                                relationTo: "authors",
                                value: author,
                              }}
                              label={author.name}
                              type="reference"
                            />
                            {i < numAuthors - 1 && (
                              <span>
                                {i === numAuthors - 2 ? " and " : ", "}
                              </span>
                            )}
                          </>
                        ))}
                        {resolvedAuthors.length === 0 && (
                          <span class="text-red-600 bg-red-100 px-2 py-0.5 rounded">
                            add at least one author
                          </span>
                        )}
                      </div>
                      <div class="text-xs sm:text-sm text-gray-600">
                        {formattedDate}
                      </div>
                    </div>
                  </div>
                  <div class=" space-x-2 hidden md:flex">
                    {/* <button
                      // onClick={handleListen}
                      class="p-2 bg-gray-100 rounded-full"
                      disabled={true}
                    >
                      <IconPlayerPlay size={20} />
                    </button> */}
                    <CopyLinkIsland />
                  </div>
                </div>
              </div>
              <RichText content={post.content} font="serif" size="lg" black />
            </div>
            <hr />
            <div class="max-w-2xl flex items-start flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {resolvedAuthors.map((author) => (
                <AuthorCard author={author} />
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
