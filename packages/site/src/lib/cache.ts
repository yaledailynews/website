import { getPayload, type Where } from "payload";
import type { Collection, Collections, Global } from "./types";
import { getId } from "./utils";
import configPromise from "@cms/payload.config";
import { useContext } from "hono/jsx";
import { CacheContext } from "./renderWithCache";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { DraftContext } from "@site/components/server/Draft";

export const payload = await getPayload({ config: configPromise });

const env = z
  .object({
    CLOUDFLARE_ZONE_ID: z.string().min(1),
    CLOUDFLARE_API_KEY: z.string().min(1),
    SITE_HOST: z.string().min(1),
  })
  .parse(process.env);

export async function purgeCloudflare() {
  console.log("Purging Cloudflare cache");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.CLOUDFLARE_API_KEY}`,
    },
    body: JSON.stringify({ purge_everything: true }),
  };
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`,
    options
  );
  const data = await res.json();
  console.log(data);
  if (data.success) {
    console.log("Successfully purged cache");
  } else {
    throw new Error("Failed to purge Cloudflare cache");
  }
}

// TODO: implement a real cache (find a lib?)
const store = new Map<string, any>();

export async function purgeKeys(keys: string[]) {
  // TODO: keep track of which urls have which tags (up to 300 urls per tag, then just mark as purge all)
  // for (const key of keys) {
  //   console.log(`Purging key ${key}`);
  //   store.delete(key);
  // }
  store.clear();
  if (import.meta.env["PROD"]) {
    await purgeCloudflare();
  }
}

function cache<T>(key: string, fn: (draft: boolean) => Promise<T>) {
  const draft = useContext(DraftContext);
  if (draft) {
    return fn(true);
  }
  const keys = useContext(CacheContext);
  keys.add(key);
  if (store.has(key)) {
    return store.get(key) as T;
  }
  const result = fn(false);
  result.then((result) => store.set(key, result));
  return result;
}

export const getDocBySlug = <T extends Collection>(
  collection: T,
  slug: string,
  depth = 2
) =>
  cache(
    `${collection}_${slug}`,
    async (draft) =>
      (
        await payload.find({
          collection,
          depth,
          draft,
          overrideAccess: draft,
          where: {
            slug: {
              equals: slug,
            },
          },
        })
      ).docs[0] as Collections[T] | null
  );

export const getGlobal = <T extends Global>(slug: T, depth = 2) =>
  cache(`global_${slug}`, (draft) =>
    payload.findGlobal({
      slug,
      depth,
      draft,
      overrideAccess: draft,
    })
  );

export const getDocById = <T extends Collection>(
  collection: T,
  entry: number | Collections[T],
  depth = 2
) => {
  const id = getId(entry);

  return cache(`${collection}_id_${id}`, async (draft) => {
    if (typeof entry === "object") {
      return entry;
    }
    try {
      const result = await payload.findByID({
        collection,
        draft,
        overrideAccess: draft,
        depth,
        id,
      });
      if (!result) {
        throw new HTTPException(404, {
          message: `Document with id ${entry} not found in ${collection}`,
        });
      }
      return result;
    } catch (e) {
      return;
    }
  });
};

export const getDoc = <T extends Collection>(
  collection: T,
  entry: Collections[T] | number | string,
  depth = 2
) => {
  if (typeof entry === "string") {
    return getDocBySlug(collection, entry, depth);
  }
  return getDocById(collection, entry, depth);
};

export const getPostsByCategory = (id: number, depth = 2, limit = 100, where?: Where) =>
  cache(`posts_category_${id}`, async (draft) => {
    const { docs: posts } = await payload.find({
      collection: "posts",
      depth,
      limit,
      draft,
      overrideAccess: draft,
      where: {
        categories: {
          contains: id,
        },
        ...where,
      },
    });

    // tag each post for revalidation
    for (const post of posts) {
      getDocById("posts", post.id, depth);
    }

    return posts;
  });

export const getPostsByAuthor = (id: number, depth = 2, limit = 100) =>
  cache(`posts_author_${id}`, async (draft) => {
    const { docs: posts } = await payload.find({
      collection: "posts",
      depth,
      limit,
      draft,
      overrideAccess: draft,
      where: {
        authors: {
          contains: id,
        },
      },
      sort: "-publishedAt",
    });

    // tag each post for revalidation
    for (const post of posts) {
      getDocById("posts", post.id, depth);
    }

    return posts;
  });

export const getMediaByAuthor = (id: number, depth = 2, limit = 100) =>
  cache(`media_author_${id}`, async (draft) => {
    const { docs: media } = await payload.find({
      collection: "media",
      depth,
      limit,
      draft,
      overrideAccess: draft,
      where: {
        author: {
          equals: id,
        },
      },
    });

    // tag each media for revalidation
    for (const medium of media) {
      getDocById("media", medium.id, depth);
    }

    return media;
  });
