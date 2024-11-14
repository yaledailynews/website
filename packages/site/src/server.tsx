import { Hono } from "hono";
import { BaseHtml } from "@site/components/server/BaseHtml";
import { getDocBySlug, getGlobal } from "@site/lib/cache";
import { queryLayout } from "@site/lib/layoutQuery";
import { HomeHeader } from "@site/components/server/HomeHeader";
import { StandardContainer } from "@site/components/universal/StandardContainer";
import { PageComponent } from "@site/components/server/PageComponent";
import { PostComponent } from "@site/components/server/PostComponent";
import { HTTPException } from "hono/http-exception";
import { staticFileHandler } from "../builder/staticFileHandler";
import { CopyLinkIsland } from "@site/components/client/CopyLink";
import { renderWithCache } from "@site/lib/renderWithCache";

const app = new Hono();

staticFileHandler(app);

app.get("/", async (c) => {
  const settings = await getGlobal("settings");
  const queryResult = await queryLayout(settings.homeLayout);

  if (!queryResult) return c.text("No layout found", 500);

  return renderWithCache(
    c,
    <BaseHtml>
      <StandardContainer>
        <HomeHeader />
        <h1>{queryResult.layout.title}</h1>
        <CopyLinkIsland />
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
  throw new HTTPException(400, {
    message: "Category not found",
  });
});

app.notFound((c) => {
  return c.text("Not found", 404);
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  }
  return c.text("Internal server error", 500);
});

export default app;
