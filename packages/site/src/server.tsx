import { Hono } from "hono";
import { BaseHtml } from "@site/components/server/BaseHtml";
import { getDocBySlug, getGlobal } from "@site/lib/cache";
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

const app = new Hono();

staticFileHandler(app);

app.get("/", async (c) => {
  const settings = await getGlobal("settings");
  const resolvedLayout = await resolveLayout(settings.homeLayout);

  if (!resolvedLayout) return c.text("No layout found", 500);

  return renderWithCache(
    c,
    <BaseHtml>
      <StandardContainer>
        <HomeHeader />
        <LayoutComponent {...resolvedLayout} />
      </StandardContainer>
    </BaseHtml>,
  );
});

app.get("/:slug", async (c, next) => {
  const slug = c.req.param("slug");
  const page = await getDocBySlug("pages", slug);

  if (!page) {
    return next();
  }

  return renderWithCache(
    c,
    <BaseHtml title={page.title}>
      <PageComponent page={page} />
    </BaseHtml>,
  );
});

app.get("/posts/:slug", async (c, next) => {
  const slug = c.req.param("slug");
  const post = await getDocBySlug("posts", slug);

  if (!post) {
    return next();
  }

  return renderWithCache(
    c,
    <BaseHtml title={post.title}>
      <PostComponent post={post} />
    </BaseHtml>,
  );
});

app.get("/categories/:slug", async (c, next) => {
  const slug = c.req.param("slug");
  const category = await getDocBySlug("categories", slug);

  if (!category) {
    return next();
  }

  return renderWithCache(
    c,
    <BaseHtml title={category.title}>
      <CategoryPage category={category} />
    </BaseHtml>,
  );
});

app.get("/layouts/:slug", async (c, next) => {
  const slug = c.req.param("slug");
  const resolvedLayout = await resolveLayout(slug);

  if (!resolvedLayout) {
    return next();
  }

  return renderWithCache(
    c,
    <BaseHtml title={resolvedLayout.layout.title}>
      <div className="flex flex-col gap-16">
        <SmallHeader />
        <StandardContainer>
          <LayoutComponent {...resolvedLayout} />
        </StandardContainer>
      </div>
    </BaseHtml>,
  );
});

app.get("/search", (c) => {
  return renderWithCache(
    c,
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
    </BaseHtml>,
  );
});

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
