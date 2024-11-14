import type { FC, PropsWithChildren } from "hono/jsx";
import { Footer } from "./Footer";

const deploymentId = process.env["RAILWAY_DEPLOYMENT_ID"];

export const BaseHtml: FC<PropsWithChildren<{ title?: string }>> = ({
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
              src={`/static/${deploymentId}/client.js`}
            ></script>
            <link
              rel="stylesheet"
              href={`/static/${deploymentId}/client.css`}
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
