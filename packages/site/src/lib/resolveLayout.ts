import type { Layout, Post } from "@cms/payload-types";
import { getId } from "./utils";
import { templateConstraints } from "@cms/collections/Layouts/blocks/Articles";
import { getDoc, getDocById, getPostsByCategory } from "./cache";

export const resolveLayout = async (entry: string | number | Layout | undefined) => {
  if (!entry) return null;
  const layout = await getDoc("layouts", entry, 4);
  if (!layout) return null;

  // resolve posts
  const resolvedPosts = new Map<number, Post[]>();
  if (layout.blocks) {
    const alreadyFound: number[] = [];
    for (const block of layout.blocks || []) {
      if (
        block.blockType === "layoutsArticles" &&
        block.source === "manual" &&
        block.posts
      ) {
        for (const post of block.posts) {
          alreadyFound.push(getId(post));
        }
      }
    }
    for (let i = 0; i < layout.blocks.length; i++) {
      const block = layout.blocks[i];
      if (
        block.blockType === "layoutsArticles" &&
        block.source === "latestFromCategory" &&
        block.category
      ) {
        const { auto } = templateConstraints[block.template];
        const posts = await getPostsByCategory(getId(block.category), 0, auto, {
          id: {
            not_in: alreadyFound,
          },
        });

        resolvedPosts.set(i, posts);
        for (const post of posts) {
          alreadyFound.push(getId(post));
        }
      } else if (
        block.blockType === "layoutsArticles" &&
        block.source === "manual" &&
        block.posts
      ) {
        const posts = (
          await Promise.all(block.posts.map((post) => getDocById("posts", post, 2)))
        ).filter((post): post is Post => post !== null);
        resolvedPosts.set(i, posts);
      }
    }
  }

  return { layout, resolvedPosts };
};

export type ResolvedLayout = NonNullable<Awaited<ReturnType<typeof resolveLayout>>>;
