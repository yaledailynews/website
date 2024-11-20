import type { PropsWithChildren } from "hono/jsx";
import { Footer } from "./Footer";
import type { SC } from "@site/lib/types";

const GIT_COMMIT_SHA = process.env["RAILWAY_GIT_COMMIT_SHA"];
if (!GIT_COMMIT_SHA) {
  throw new Error("Missing RAILWAY_GIT_COMMIT_SHA");
}

type OGAudio = {
  url: string;
  secureUrl?: string | null;
  type: string;
};

type OG = {
  title: string;
  description?: string | null;
  image?: string | null;
  url: string;
  type: "article" | "website";
  siteName?: string;
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  publisher?: string;
  section?: string;
  authors?: string[];
  tags?: string[];
  audio?: OGAudio[];
};

export const BaseHtml: SC<PropsWithChildren<{ title?: string; og?: OG }>> = ({
  children,
  title,
  og,
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

        {/* Open Graph */}
        {og && <meta property="og:title" content={og.title} />}
        {og && og.description && (
          <meta property="og:description" content={og.description} />
        )}
        {og && <meta property="og:url" content={og.url} />}
        {og && <meta property="og:type" content={og.type} />}
        {og && og.image && <meta property="og:image" content={og.image} />}
        {og && og.siteName && (
          <meta property="og:site_name" content={og.siteName} />
        )}
        {og && og.locale && <meta property="og:locale" content={og.locale} />}
        {og && og.publishedTime && (
          <meta property="article:published_time" content={og.publishedTime} />
        )}
        {og && og.modifiedTime && (
          <meta property="article:modified_time" content={og.modifiedTime} />
        )}
        {og && og.publisher && (
          <meta property="article:publisher" content={og.publisher} />
        )}
        {og && og.section && (
          <meta property="article:section" content={og.section} />
        )}
        {og &&
          og.authors &&
          og.authors.map((author) => (
            <meta property="article:author" content={author} />
          ))}
        {og &&
          og.tags &&
          og.tags.map((tag) => <meta property="article:tag" content={tag} />)}
        {og &&
          og.audio &&
          og.audio.map((audio) => (
            <>
              <meta property="og:audio" content={audio.url} />
              {audio.secureUrl && (
                <meta
                  property="og:audio:secure_url"
                  content={audio.secureUrl}
                />
              )}
              <meta property="og:audio:type" content={audio.type} />
            </>
          ))}
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
