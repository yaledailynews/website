import { Hono } from "hono";
import { BaseHtml } from "@site/components/server/BaseHtml";
import { getDocBySlug, getGlobal, purgeKeys } from "@site/lib/cache";
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

const app = new Hono();

staticFileHandler(app);

app.get(
  "/",
  renderWithCache(async () => {
    const settings = await getGlobal("settings");
    const resolvedLayout = await resolveLayout(settings.homeLayout);

    if (!resolvedLayout) {
      throw new HTTPException(500);
    }

    return (
      <BaseHtml>
        <StandardContainer>
          <HomeHeader />
          <LayoutComponent {...resolvedLayout} />
        </StandardContainer>
      </BaseHtml>
    );
  }),
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
  }),
);

app.get(
  "/posts/:slug",
  renderWithCache(async ({ c }) => {
    const slug = c.req.param("slug");
    const post = await getDocBySlug("posts", slug);

    if (!post) {
      throw new HTTPException(404);
    }
    return (
      <BaseHtml title={post.title}>
        <PostComponent post={post} />
      </BaseHtml>
    );
  }),
);

// export async function generateMetadata({ params }: Args): Promise<Metadata> {
//   const { slug } = await params
//   if (!slug) return { title: 'Not Found' }
//   const post = await getDocBySlug('posts', slug)()
//   if (!post) return { title: 'Not Found' }
//   const authors = (
//     post.authors
//       ? await Promise.all(post.authors.map((author) => getDocById('authors', author)()))
//       : []
//   ).map((author) => author.name)

//   const section = (
//     post.categories
//       ? await Promise.all(post.categories.map((category) => getDocById('categories', category)()))
//       : []
//   )[0]?.title

//   const cover = post.cover ? await getDocById('media', post.cover)() : undefined

//   const coverSized = cover?.sizes?.xl ?? cover

//   return {
//     title: post.title,
//     description: post.subhead,
//     openGraph: {
//       title: post.title,
//       type: 'article',
//       authors,
//       description: post.subhead ?? undefined,
//       publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
//       modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
//       countryName: 'United States',
//       locale: 'en_US',
//       section,
//       siteName: 'The Yale Daily News',
//       url: `${env.NEXT_PUBLIC_SERVER_URL}/posts/${post.slug}`,
//       images:
//         cover && coverSized && coverSized.filename && coverSized.width && coverSized.height
//           ? [
//               {
//                 url: `${env.NEXT_PUBLIC_S3_URL}/${coverSized.filename}`,
//                 width: coverSized.width,
//                 height: coverSized.height,
//                 alt: cover.alt,
//               },
//             ]
//           : undefined,
//     },
//   }
// }

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
  }),
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
  }),
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
  }),
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
  )),
);

const purgeSchema = z.object({
  keys: z.array(z.string()),
});

app.post("/purge", async (c) => {
  const data = await c.req.json();
  const input = purgeSchema.safeParse(data);
  if (!input.success) {
    return c.json({ error: "Invalid request" }, 400);
  }
  try {
    purgeKeys(input.data.keys);
  } catch (e) {
    return c.json({ error: "Failed to purge keys" }, 500);
  }

  return c.json({ success: true });
});

// fetch("http://localhost:3000/purge", { method: "POST", body: JSON.stringify({ keys: [""] }) });

app.notFound((c) => {
  return c.html(
    <BaseHtml title="404">
      <NotFound />
    </BaseHtml>,
    404,
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
