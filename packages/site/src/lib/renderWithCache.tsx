import type { Context, Next } from "hono";
import { createContext } from "hono/jsx";
import type { SC } from "./types";
import { HTTPException } from "hono/http-exception";

export const CacheContext = createContext(new Set<string>());

export function renderWithCache(Component: SC<{ c: Context }>) {
  return async (c: Context, next: Next) => {
    const keys = new Set<string>();
    try {
      const html = await c.html(
        <CacheContext.Provider value={keys}>
          <Component c={c} />
        </CacheContext.Provider>,
      );
      html.headers.set("Cache-Control", "public, max-age=7776000"); // three month expiry
      html.headers.set("Cache-Tag", Array.from(keys).join(",")); // cache tags for purging
      return html;
    } catch (e) {
      if (e instanceof HTTPException) {
        if (e.status === 404) {
          return next();
        } else {
          throw e;
        }
      } else {
        throw e;
      }
    }
  };
}
