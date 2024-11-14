import { Hono } from "hono";
import { BaseHtml } from "@site/components/BaseHtml";
import { getDocBySlug, getGlobal } from "./lib/cache";
import { queryLayout } from "./lib/layoutQuery";
import { HomeHeader } from "./components/HomeHeader";
import { StandardContainer } from "./components/StandardContainer";
import { PageComponent } from "./components/PageComponent";
import { PostComponent } from "./components/PostComponent";
import { HTTPException } from "hono/http-exception";
import { staticFileHandler } from "../builder/staticFileHandler";
import { CopyLinkIsland } from "./client/CopyLink";
import { renderWithCache } from "./lib/renderWithCache";

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
