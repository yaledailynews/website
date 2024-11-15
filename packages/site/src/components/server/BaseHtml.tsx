import type { PropsWithChildren } from "hono/jsx";
import { Footer } from "./Footer";
import type { SC } from "@site/lib/types";

const GIT_COMMIT_SHA = process.env["RAILWAY_GIT_COMMIT_SHA"];
if (!GIT_COMMIT_SHA) {
  throw new Error("Missing RAILWAY_GIT_COMMIT_SHA");
}

export const BaseHtml: SC<PropsWithChildren<{ title?: string }>> = ({
  children,
  title,
}) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <meta name="viewport" content="width=device-width" />
        <meta name="generator" content="Hono" />
        <link rel="stylesheet" href="https://use.typekit.net/wkm0djp.css" />
        {import.meta.env["PROD"] ? (
          <>
            <script
              type="module"
              defer
              src={`/static/${GIT_COMMIT_SHA}/client.js`}
            ></script>
            <link
              rel="stylesheet"
              href={`/static/${GIT_COMMIT_SHA}/client.css`}
            />
          </>
        ) : (
          <script type="module" src="/src/client.tsx"></script>
        )}
        <title>
          {title
            ? `${title} - Yale Daily News`
            : "Yale Daily News - The Oldest College Daily"}
        </title>
      </head>
      <body>
        <div class="min-h-screen flex flex-col gap-5">
          <div class="flex-grow">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
};
