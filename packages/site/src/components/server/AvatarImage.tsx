import type { Media } from "@cms/payload-types";
import { getDocById } from "@site/lib/cache";
import type { SC } from "@site/lib/types";
import type { CSSProperties } from "hono/jsx";

type Props = {
  media?: Media | string | number | null;
  size: "sm" | "lg";
  class?: string;
  style?: CSSProperties;
};

export const AvatarImage: SC<Props> = async ({ media, size, ...props }) => {
  if (!media) return <></>;
  if (typeof media === "string") return <></>;

  const { alt, sizes } = await getDocById("media", media);
  if (!sizes || !sizes || !alt) {
    return <div class="text-red-500">Missing sizes or alt</div>;
  }
  const avatar = sizes[`avatar-${size}`];
  if (!avatar || !avatar.filename || !avatar.width || !avatar.height) {
    return <div class="text-red-500">Missing avatar</div>;
  }
  const url = `${process.env["NEXT_PUBLIC_S3_URL"]}/${avatar.filename}`;

  return (
    <img
      src={url}
      alt={alt}
      width={avatar.width}
      height={avatar.height}
      loading="lazy"
      {...props}
    />
  );
};
