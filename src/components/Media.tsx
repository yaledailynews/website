import Image, { ImageProps } from "next/image";
import Link from "next/link";
import type { Media as MediaType } from '@/payload-types'

export async function Media({
  media,
  href,
  figureClassName,
  ...props
}: {
  media?: MediaType | string | number | null;
  href?: string;
  figureClassName?: string;
} & Partial<ImageProps>) {
  if (!media) return null;
  if (typeof media === "string") return null;
  if (typeof media === "number") return null; // TODO: resolve
  if (!media.url) return null;

  const ImageComponent = media.width && media.height ?
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width}
      height={media.height}
      {...props}
    /> : <Image src={media.url} alt={media.alt} {...props} />;

  return (
    <figure
      className={
        "w-full flex flex-col items-end" + (figureClassName ? ` ${figureClassName}` : "")
      }
    >
      <div className="w-full mb-2">
        {href ? (
          <Link href={href} className="w-full">
            {ImageComponent}
          </Link>
        ) : ImageComponent}
      </div>
      {media.author && typeof media.author !== "number" && (
        <figcaption className="text-xs text-gray-500">
          <Link href={`/authors/${media.author.slug}`}>{media.author.name}</Link>
        </figcaption>
      )}
      {/* {media.credit && (
        <figcaption className="text-xs text-gray-500">{media.credit}</figcaption>
      )} */}
    </figure>
  );
}

