import type { Context } from "hono";
import type { Child } from "hono/jsx";
import { createContext } from "hono/jsx";

export const CacheContext = createContext(new Set<string>());

export async function renderWithCache(c: Context, jsx: Child) {
  const keys = new Set<string>();
  const html = await c.html(
    <CacheContext.Provider value={keys}>{jsx}</CacheContext.Provider>,
  );

  const cacheTagHeader = Array.from(keys).join(",");
  console.log(`Cache-Tag: ${cacheTagHeader}`);
  html.headers.set("Cache-Tag", cacheTagHeader);

  return html;
}
