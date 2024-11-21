import { Hono } from "hono";
import { BaseHtml } from "@site/components/server/BaseHtml";
import {
  getDocById,
  getDocBySlug,
  getGlobal,
  purgeCloudflare,
  purgeKeys,
} from "@site/lib/cache";
import { HomeHeader } from "@site/components/server/HomeHeader";
import { StandardContainer } from "@site/components/universal/StandardContainer";
import { PageComponent } from "@site/components/server/PageComponent";
import { PostComponent } from "@site/components/server/PostComponent";
import { HTTPException } from "hono/http-exception";
import { staticFileHandler } from "@builder/staticFileHandler";
import { renderWithCache } from "@site/lib/renderWithCache";
import { LayoutComponent } from "@site/components/server/layouts/LayoutComponent";
import { NotFound } from "./components/server/NotFound";
import { CategoryPage } from "./components/server/CategoryPage";
import { resolveLayout } from "./lib/resolveLayout";
import { SmallHeader } from "./components/server/SmallHeader";
import { MeiliSearchIsland } from "./components/client/MeiliSearch";
import { AuthorPage } from "./components/server/AuthorPage";
import { z } from "zod";
import crypto from "node:crypto";
import { Draft } from "./components/server/Draft";
import type { JSXElement, SC } from "./lib/types";

const app = new Hono();

const SITE_HOST = process.env["SITE_HOST"];
if (!SITE_HOST) {
  throw new Error("Missing SITE_HOST");
}
const DRAFT_SECRET = process.env["DRAFT_SECRET"];
if (!DRAFT_SECRET) {
  throw new Error("Missing DRAFT_SECRET");
}

staticFileHandler(app);

app.get(
  "/",
  renderWithCache(async () => {
    const settings = await getGlobal("settings");
    const resolvedLayout = await resolveLayout(settings.homeLayout);

    if (!resolvedLayout) {
      throw new HTTPException(500, {
        message: "No home layout found",
      });
    }

    return (
      <BaseHtml>
        <StandardContainer>
          <HomeHeader />
          <LayoutComponent {...resolvedLayout} />
        </StandardContainer>
      </BaseHtml>
    );
  })
);

app.get(
  "/:slug",
  renderWithCache(async ({ c }) => {
    const slug = c.req.param("slug");
    const page = await getDocBySlug("pages", slug);

    if (!page) {
      throw new HTTPException(404);
    }
    return (
      <BaseHtml title={page.title}>
        <PageComponent page={page} />
      </BaseHtml>
    );
  })
);

app.get(
  "/posts/:slug",
  renderWithCache(async ({ c }) => {
    const slug = c.req.param("slug");
    const post = await getDocBySlug("posts", slug, 4);

    if (!post) {
      throw new HTTPException(404);
    }

    const cover = (post.cover && (await getDocById("media", post.cover))) || undefined;

    const authors = (
      post.authors
        ? await Promise.all(post.authors.map((author) => getDocById("authors", author)))
        : []
    )
      .filter((author) => !!author)
      .map((author) => author.name);

    const section =
      (post.categories &&
        post.categories.length > 0 &&
        (await getDocById("categories", post.categories[0]))?.title) ||
      undefined;

    return (
      <BaseHtml
        title={post.title}
        og={{
          title: post.title,
          description: post.subhead,
          image: cover?.sizes?.xl?.filename,
          url: `https://${SITE_HOST}/posts/${post.slug}`,
          type: "article",
          section,
          authors,
          locale: "en_US",
          modifiedTime: post.updatedAt,
          publishedTime: post.createdAt,
          publisher: "Yale Daily News",
          siteName: "Yale Daily News",
        }}
      >
        <PostComponent post={post} />
      </BaseHtml>
    );
  })
);

app.get(
  "/categories/:slug",
  renderWithCache(async ({ c }) => {
    const slug = c.req.param("slug");
    const category = await getDocBySlug("categories", slug);

    if (!category) {
      throw new HTTPException(404);
    }

    return (
      <BaseHtml title={category.title}>
        <CategoryPage category={category} />
      </BaseHtml>
    );
  })
);

app.get(
  "/layouts/:slug",
  renderWithCache(async ({ c }) => {
    const slug = c.req.param("slug");
    const resolvedLayout = await resolveLayout(slug);

    if (!resolvedLayout) {
      throw new HTTPException(404);
    }

    return (
      <BaseHtml title={resolvedLayout.layout.title}>
        <div className="flex flex-col gap-16">
          <SmallHeader />
          <StandardContainer>
            <LayoutComponent {...resolvedLayout} />
          </StandardContainer>
        </div>
      </BaseHtml>
    );
  })
);

app.get(
  "/authors/:slug",
  renderWithCache(async ({ c }) => {
    const slug = c.req.param("slug");
    const author = await getDocBySlug("authors", slug);

    if (!author) {
      throw new HTTPException(404);
    }

    return (
      <BaseHtml title={author.name}>
        <AuthorPage author={author} />
      </BaseHtml>
    );
  })
);

app.get(
  "/search",
  renderWithCache(() => (
    <BaseHtml title="Search">
      <div className="flex flex-col gap-8">
        <SmallHeader />
        <StandardContainer>
          <main className="w-full flex flex-col items-center gap-5 pb-6 sm:pb-8 md:pb-10 lg:pb-14 overflow-hidden">
            <div className="py-4 sm:py-6 md:py-8 lg:py-9 flex flex-col items-center w-full">
              <div className="max-w-screen-sm px-5 md:px-0 md:mx-0 flex flex-col gap-7 sm:gap-12 justify-start w-full">
                <MeiliSearchIsland />
              </div>
            </div>
          </main>
        </StandardContainer>
      </div>
    </BaseHtml>
  ))
);

const purgeSchema = z.object({
  keys: z.array(z.string()),
});

app.get("/preview", async (c) => {
  const { collection, id, time, hash } = z
    .object({
      collection: z.enum(["posts", "pages", "layouts"]),
      id: z.string().transform(Number),
      time: z.string().transform(Number),
      hash: z.string(),
    })
    .parse(c.req.query());

  // 60 minutes
  if (time < Date.now() - 1000 * 60 * 60) {
    throw new HTTPException(403, { message: "Preview link expired" });
  }

  // verify signature
  const hashCheck = crypto
    .createHmac("sha256", DRAFT_SECRET)
    .update(`${collection}${id}${time}`)
    .digest("hex");

  if (hash !== hashCheck) {
    throw new HTTPException(403, { message: "Invalid signature" });
  }

  const RenderDraft: SC =
    collection === "layouts"
      ? async () => {
          const layout = await resolveLayout(id);
          if (!layout) {
            throw new HTTPException(404, { message: "Layout not found" });
          }
          return (
            <div class="flex flex-col gap-16">
              <SmallHeader />
              <StandardContainer>
                <LayoutComponent {...layout} />
              </StandardContainer>
            </div>
          );
        }
      : collection === "posts"
        ? async () => {
            const post = await getDocById("posts", id, 4);
            if (!post) {
              throw new HTTPException(404, { message: "Post not found" });
            }
            return <PostComponent post={post} />;
          }
        : async () => {
            const page = await getDocById("pages", id, 4);
            if (!page) {
              throw new HTTPException(404, { message: "Page not found" });
            }
            return <PageComponent page={page} />;
          };

  return c.html(
    <Draft>
      <BaseHtml title="Preview">
        <RenderDraft />
      </BaseHtml>
    </Draft>,
    200,
    {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    }
  );
});

app.post("/purge", async (c) => {
  const data = await c.req.json();
  const input = purgeSchema.safeParse(data);
  if (!input.success) {
    return c.json({ error: "Invalid request" }, 400);
  }
  try {
    await purgeKeys(input.data.keys);
  } catch (e) {
    return c.json({ error: "Failed to purge keys" }, 500);
  }

  return c.json({ success: true });
});

// on server start, purge the cache
if (import.meta.env["PROD"]) {
  purgeCloudflare();
}

app.notFound((c) => {
  return c.html(
    <BaseHtml title="404">
      <NotFound />
    </BaseHtml>,
    404
  );
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  }
  console.error(err);
  return c.text("Internal server error", 500);
});

export default app;
