import { getPayload, type Where } from "payload";
import type { Collection, Collections, Global } from "./types";
import { getId } from "./utils";
import configPromise from "@cms/payload.config";
import { useContext } from "hono/jsx";
import { CacheContext } from "./renderWithCache";
import { z } from "zod";
import Cloudflare from "cloudflare";

export const payload = await getPayload({ config: configPromise });

const env = z
  .object({
    CLOUDFLARE_ZONE_ID: z.string().min(1),
    CLOUDFLARE_API_KEY: z.string().min(1),
    CLOUDFLARE_EMAIL: z.string().min(1),
    SITE_HOST: z.string().min(1),
  })
  .parse(process.env);

const client = new Cloudflare({
  apiEmail: env.CLOUDFLARE_EMAIL,
  apiKey: env.CLOUDFLARE_API_KEY,
});

const store = new Map<string, any>();
export async function purgeKeys(keys: string[]) {
  for (const key of keys) {
    console.log(`Purging key ${key}`);
    store.delete(key);
  }
  // const options = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${env.CLOUDFLARE_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     // hosts: [env.SITE_HOST],
  //     tags: keys,
  //   }),
  // };

  // const res = await fetch(
  //   `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`,
  //   options,
  // );
  // const data = await res.json();
  // console.log(data);
  // if (data.success) {
  //   console.log("Successfully purged cache");
  // } else {
  //   throw new Error("Failed to purge Cloudflare cache");
  // }

  const response = await client.cache.purge({
    zone_id: env.CLOUDFLARE_ZONE_ID,
    tags: keys,
  });
  console.log(response);
}

function cache<T>(key: string, fn: () => Promise<T>) {
  const keys = useContext(CacheContext);
  keys.add(key);
  if (store.has(key)) {
    return store.get(key) as T;
  }
  console.log(`Cache miss for key ${key}`);
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
