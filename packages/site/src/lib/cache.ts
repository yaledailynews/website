import { getPayload, type Where } from "payload";
import type { Collection, Collections, Global } from "./types";
import { getId } from "./utils";
import configPromise from "@cms/payload.config";
import { useContext } from "hono/jsx";
import { CacheContext } from "./renderWithCache";

export const payload = await getPayload({ config: configPromise });

// TODO: add the Cache-Tag and Cache-Control header to the response, and create a cache invalidation endpoint
export const store = new Map<string, any>();

function cache<T>(key: string, fn: () => Promise<T>) {
  const keys = useContext(CacheContext);
  keys.add(key);
  if (store.has(key)) {
    console.log(`Cache hit for ${key}`);
    return store.get(key) as T;
  }
  const result = fn();
  result.then((result) => store.set(key, result));
  return result;
}

export const getDocBySlug = <T extends Collection>(
  collection: T,
  slug: string,
  depth = 2,
) =>
  cache(
    `${collection}_${slug}`,
    async () =>
      (
        await payload.find({
          collection,
          depth,
          draft: false,
          overrideAccess: false,
          where: {
            slug: {
              equals: slug,
            },
          },
        })
      ).docs[0] as Collections[T] | null,
  );

export const getGlobal = <T extends Global>(slug: T, depth = 2) =>
  cache(`global_${slug}`, () =>
    payload.findGlobal({
      slug,
      depth,
      draft: false,
      overrideAccess: false,
    }),
  );

export const getDocById = <T extends Collection>(
  collection: T,
  entry: number | Collections[T],
  depth = 2,
) => {
  const id = getId(entry);
  return cache(`${collection}_id_${id}`, async () => {
    if (typeof entry === "object") {
      return entry;
    }
    const result = await payload.findByID({
      collection,
      draft: false,
      overrideAccess: false,
      depth,
      id,
    });
    if (!result) {
      throw new Error(
        `Document with id ${entry} not found in collection ${collection}`,
      );
    }
    return result;
  });
};

export const getDoc = <T extends Collection>(
  collection: T,
  entry: Collections[T] | number | string,
) => {
  if (typeof entry === "string") {
    return getDocBySlug(collection, entry);
  }
  return getDocById(collection, entry);
};

export const getPostsByCategory = (
  id: number,
  depth = 2,
  limit = 100,
  where?: Where,
) =>
  cache(`posts_category_${id}`, async () => {
    const { docs: posts } = await payload.find({
      collection: "posts",
      depth,
      limit,
      where: {
        categories: {
          contains: id,
        },
        ...where,
      },
    });

    // tag each post for revalidation
    for (const post of posts) {
      getDocById("posts", post.id);
    }

    return posts;
  });

export const getPostsByAuthor = (id: number, depth = 2, limit = 100) =>
  cache(`posts_author_${id}`, async () => {
    const { docs: posts } = await payload.find({
      collection: "posts",
      depth,
      limit,
      where: {
        authors: {
          contains: id,
        },
      },
      sort: "-publishedAt",
    });

    // tag each post for revalidation
    for (const post of posts) {
      getDocById("posts", post.id);
    }

    return posts;
  });

export const getMediaByAuthor = (id: number, depth = 2, limit = 100) =>
  cache(`media_author_${id}`, async () => {
    const { docs: media } = await payload.find({
      collection: "media",
      depth,
      limit,
      where: {
        author: {
          equals: id,
        },
      },
    });

    // tag each media for revalidation
    for (const medium of media) {
      getDocById("media", medium.id);
    }

    return media;
  });
