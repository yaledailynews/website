import type { SC } from "@site/lib/types";
import { createContext, type PropsWithChildren } from "hono/jsx";

export const DraftContext = createContext(false);

export const Draft: SC<PropsWithChildren> = ({ children }) => {
  return <DraftContext.Provider value={true}>{children}</DraftContext.Provider>;
};
