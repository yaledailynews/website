import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from '@payload-config'
import { PayloadRedirects } from "@/components/PayloadRedirects"
import { cache } from "react"
import { draftMode } from "next/headers"
import { TextBlock } from "@/blocks/Layout/Text/Component"
import { ArticlesBlock } from "@/blocks/Layout/Articles/Component"
import { PodcastsBlock } from "@/blocks/Layout/Podcasts/Component"
import { NewsletterBlock } from "@/blocks/Layout/Newsletter/Component"
import { cn } from "@/utilities/cn"
import { Category, Layout, Post } from "@/payload-types"
import Link from "next/link"
import { getId } from "@/utilities/getId"
import { templateConstraints } from "@/blocks/Layout/Articles/config"

type LayoutBlocks = NonNullable<Layout["blocks"]>;
type LayoutBlock = LayoutBlocks[0];

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const layouts = await payload.find({
    collection: 'layouts',
    draft: false,
    limit: 100000,
    overrideAccess: false,
  })

  const params = layouts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

function BlocksForPosition({
  position,
  layout,
  resolvedPosts,
}: {
  layout: Layout;
  resolvedPosts: Map<number, Post[]>;
  position?: LayoutBlock["desktopPosition"];
}) {
  let displayIndex = 0;

  if (!layout.blocks) return null;

  return (
    <>
      {layout.blocks.map((block, index) => {

        if (position && block.desktopPosition !== position) return null;

        const hideBorder = displayIndex === 0 && block.desktopPosition === "default";
        const hideBorderMd = displayIndex === 0 && block.desktopPosition === "sidebar";

        displayIndex++;

        const posts = resolvedPosts.get(index);

        return (
          <div
            key={block.id}
            className={cn("grid gap-5 pb-3", {
              "border-t mt-2": !hideBorder,
              "md:border-t-0 md:mt-0 md:pt-0": hideBorderMd,
              "pt-2": !hideBorder && block.blockName,
              "pt-5": !hideBorder && !block.blockName,
              "md:pt-0": hideBorderMd && block.blockName,
              "border-t-gray-700":
                block.topDivider === "dark" || block.desktopPosition !== "default",
            })}
          >
            {block.blockName && block.blockType === "layoutsArticles" && (block.category ? (
              <Link href={`/category/${resolveCategorySlug(block.category)}`}>
                <h2 className={cn("text-sm font-bold")}>{block.blockName}</h2>
              </Link>
            ) : (
              <h2 className={cn("text-sm font-bold")}>{block.blockName}</h2>
            ))}
            <div className="flex flex-col gap-5">
              {block.blockType === "layoutsText" && <TextBlock block={block} layout={layout} />}
              {block.blockType === "layoutsArticles" && <ArticlesBlock block={block} layout={layout} posts={posts} />}
              {block.blockType === "layoutsPodcasts" && <PodcastsBlock block={block} layout={layout} />}
              {block.blockType === "layoutsNewsletter" && <NewsletterBlock block={block} layout={layout} />}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default async function LayoutPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/layouts/' + slug
  const result = await queryLayoutBySlug({ slug })
  if (!result) return <PayloadRedirects url={url} />

  const { layout, resolvedPosts } = result
  if (!layout.blocks) return <div>Post has no blocks</div>

  const hideSidebar = layout.template !== "standard";

  return (
    <>
      <main
        className={
          "flex-col gap-4 px-4 md:px-0 hidden md:flex" +
          (hideSidebar ? " max-w-3xl mx-auto" : "")
        }
      >
        <BlocksForPosition layout={layout} position="fullTop" resolvedPosts={resolvedPosts} />
        <div
          className={
            "grid grid-cols-1 gap-4" + (!hideSidebar ? " md:grid-cols-[5fr_2fr]" : "")
          }
        >
          <div
            className={
              "flex flex-col gap-5" +
              (!hideSidebar ? " md:border-r md:border-r-gray-400 md:pr-4" : "")
            }
          >
            <BlocksForPosition layout={layout} position="default" resolvedPosts={resolvedPosts} />
          </div>
          {!hideSidebar && (
            <div className="flex flex-col gap-5 border-t border-t-gray-800 pt-5 mt-5 md:border-t-0 md:pt-0 md:mt-0">
              <BlocksForPosition layout={layout} position="sidebar" resolvedPosts={resolvedPosts} />
            </div>
          )}
        </div>
        <BlocksForPosition layout={layout} position="fullBottom" resolvedPosts={resolvedPosts} />
      </main>
      <main className="flex flex-col gap-4 px-4 md:px-0 md:hidden">
        <BlocksForPosition layout={layout} resolvedPosts={resolvedPosts} />
      </main>
    </>
  )
}

const queryCategoryById = cache(async ({ id }: { id: number }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  return payload.findByID({
    collection: 'categories',
    id,
    draft,
    overrideAccess: draft,
  })
})

async function resolveCategorySlug(category: Category | number) {
  if (typeof category === "number") {
    const resolvedCategory = await queryCategoryById({ id: category })
    return resolvedCategory.slug
  }
  return category.slug
}

const queryLayoutBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'layouts',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (!result.docs || result.docs.length === 0) {
    return null
  }

  const layout = result.docs[0]

  // resolve articles
  const resolvedPosts = new Map<number, Post[]>()
  if (layout.blocks) {
    const alreadyFound: number[] = []
    for (const block of layout.blocks || []) {
      if (block.blockType === "layoutsArticles" && block.source === "manual" && block.posts) {
        for (const post of block.posts) {
          alreadyFound.push(getId(post))
        }
      }
    }
    for (let i = 0; i < layout.blocks.length; i++) {
      const block = layout.blocks[i]
      if (block.blockType === "layoutsArticles" && block.source === "latestFromCategory" && block.category) {
        const { auto } = templateConstraints[block.template]
        const posts = await payload.find({
          collection: 'posts',
          where: {
            category: {
              equals: getId(block.category),
            },
            id: {
              not_in: alreadyFound,
            },
          },
          limit: auto,
        })
        resolvedPosts.set(i, posts.docs)
        for (const post of posts.docs) {
          alreadyFound.push(getId(post))
        }
      } else if (block.blockType === "layoutsArticles" && block.source === "manual" && block.posts) {
        const posts = await Promise.all(
          block.posts.map((post) => {
            if (typeof post === "number") {
              return payload.findByID({
                collection: 'posts',
                id: post,
              })
            }
            return post;
          })
        )
        resolvedPosts.set(i, posts)
      }
    }
  }
  
  return { layout, resolvedPosts }
})