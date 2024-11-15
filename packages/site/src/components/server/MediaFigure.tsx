import type { Media } from "@cms/payload-types";
import type { JSX } from "hono/jsx";
import { cn } from "@site/lib/utils";
import { getDocById } from "@site/lib/cache";
import { IconFileFilled, IconPhoto } from "@site/components/universal/Icons";
import type { JSXElement } from "@site/lib/types";

const S3_URL = process.env["VITE_S3_URL"];
if (!S3_URL) {
  throw new Error("Missing VITE_S3_URL");
}

function generateSrcSet(
  filename: string,
  width: number,
  sizes: NonNullable<Media["sizes"]>,
): string {
  return (
    `${S3_URL}/${filename} ${width}w, ` +
    Object.entries(sizes)
      .filter(
        ([key, size]) => size.width && size.filename && !key.match("avatar"),
      )
      .map(([, size]) => `${S3_URL}/${size.filename} ${size.width}w`)
      .join(", ")
  );
}

type Props = {
  media?: Media | string | number | null;
  href?: string;
  fullBleed?: "sm" | "md" | "lg";
  class?: string;
  figureClass?: string;
  creditClass?: string;
  imgContainerClass?: string;
  priority?: boolean;
  hideCredit?: boolean;
  overlay?: JSXElement;
} & JSX.IntrinsicElements["img"];

export async function MediaFigure({
  media,
  href,
  figureClass,
  creditClass,
  imgContainerClass,
  priority = false,
  fullBleed,
  hideCredit,
  overlay,
  ...props
}: Props) {
  if (!media) return <></>;
  if (typeof media === "string") return <></>;

  const { alt, author, credit, sizes, filename, width, height, mimeType } =
    await getDocById("media", media);
  const resolvedAuthor = author ? await getDocById("authors", author) : null;

  let ImageComponent = <></>;

  if (mimeType?.startsWith("image")) {
    if (!filename || !width || !height) {
      return (
        <div class="text-red-500 px-4 py-2 bg-red-200 border border-red-500 flex items-center gap-3">
          <IconPhoto class="size-6" />
          Missing filename, width, or height
        </div>
      );
    }

    if (!sizes) {
      return <div class="text-red-500">Missing sizes</div>;
    }
    const srcSet = generateSrcSet(filename, width, sizes);

    const url = `${S3_URL}/${filename}`;

    ImageComponent = (
      <img
        src={url}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        srcSet={srcSet}
        {...props}
      />
    );
  } else if (mimeType?.startsWith("video")) {
    ImageComponent = (
      <video controls class="w-full bg-gray-800" preload="metadata">
        <source src={`${S3_URL}/${filename}`} type={mimeType} />
        Your browser does not support the video tag.
      </video>
    );
  } else if (mimeType?.startsWith("audio")) {
    ImageComponent = (
      <div class="flex flex-col bg-gray-800 w-full font-sans font-medium p-3">
        <audio controls preload="metadata" class="w-full rounded-none">
          <source src={`${S3_URL}/${filename}`} type={mimeType} />
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  } else if (mimeType?.startsWith("application/pdf")) {
    ImageComponent = (
      <div class="flex flex-col bg-gray-800 w-full font-sans font-medium">
        <p class="text-xs px-4 py-2 text-white flex items-center gap-2">
          <IconFileFilled size={16} class="inline-block" />
          {filename}
        </p>
        <object
          data={`${S3_URL}/${filename}`}
          type={mimeType}
          class="w-full h-full border-b min-h-[calc(60vh+3rem)]"
        >
          <a href={`${S3_URL}/${filename}`}>Download PDF</a>
        </object>
      </div>
    );
  }

  return (
    <figure
      class={
        "w-full flex flex-col items-end" +
        (figureClass ? ` ${figureClass}` : "")
      }
    >
      <div class={`w-full mb-2 bg-gray-200 ${imgContainerClass}`}>
        {href ? (
          <a href={href} class="w-full">
            {ImageComponent}
          </a>
        ) : (
          ImageComponent
        )}
        {overlay}
      </div>
      {!hideCredit &&
        (resolvedAuthor ? (
          <figcaption
            class={cn(
              "text-xs text-gray-500",
              {
                "px-3": !!fullBleed,
                "md:px-0": fullBleed === "sm",
                "lg:px-0": fullBleed === "md",
              },
              creditClass,
            )}
          >
            <a href={`/authors/${resolvedAuthor.slug}`}>
              {resolvedAuthor.name}
            </a>
          </figcaption>
        ) : (
          credit && (
            <figcaption
              class={cn(
                "text-xs text-gray-500",
                {
                  "px-3": !!fullBleed,
                  "md:px-0": fullBleed === "sm",
                  "lg:px-0": fullBleed === "md",
                },
                creditClass,
              )}
            >
              {credit}
            </figcaption>
          )
        ))}
    </figure>
  );
}
