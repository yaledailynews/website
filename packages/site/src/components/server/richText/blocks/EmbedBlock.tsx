import type { EmbedBlock as EmbedBlockType } from "@cms/payload-types";
import { cn } from "@site/lib/utils";
import type { FC } from "hono/jsx";

type Props = EmbedBlockType & {
  class?: string;
};

export const EmbedBlock: FC<Props> = ({
  class: className,
  url,
  aspectRatio,
  caption,
}) => {
  return (
    <div class={cn("bg-gray-100 border not-prose", className)}>
      <iframe
        src={url}
        style={{
          aspectRatio: aspectRatio?.split(":").map(Number).join("/"),
          width: "100%",
        }}
        frameBorder="0"
        allowFullScreen
      />
      {caption && (
        <p class="text-sm mt-2 px-4 text-gray-700 border-l-gray-800 pb-2">
          {caption}
        </p>
      )}
    </div>
  );
};
