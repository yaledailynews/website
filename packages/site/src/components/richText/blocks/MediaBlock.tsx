import type { MediaBlock as MediaBlockProps } from "@cms/payload-types";
import { MediaFigure } from "@site/components/MediaFigure";
import { cn } from "@site/lib/utils";
import type { FC } from "hono/jsx";

type Props = MediaBlockProps & {
  breakout?: boolean;
  captionClass?: string;
  class?: string;
  enableGutter?: boolean;
  id?: string;
  imgClass?: string;
};

export const MediaBlock: FC<Props> = ({
  captionClass,
  class: className,
  enableGutter = true,
  imgClass,
  media,
  caption,
  position = "default",
}) => {
  return (
    <div
      class={cn(
        {
          container: position === "default" && enableGutter,
          // TODO: fix this at sm size
          "relative left-1/2 sm:left-[calc(50%_+_7.5px)] md:left-1/2 -translate-x-1/2 w-[100vw] flex justify-center":
            position === "fullscreen" || position === "wide",
          "lg:px-8 py-2 sm:py-3 md:py-5 lg:py-6": position === "fullscreen",
          "lg:px-12 py-2 sm:py-3 md:py-5 lg:py-6": position === "wide",
        },
        className,
      )}
    >
      <div
        class={cn("pb-2 bg-gray-100 border-y lg:border-x w-full", {
          "max-w-screen-lg": position === "wide",
          "max-w-screen-2xl": position === "fullscreen",
        })}
      >
        <MediaFigure
          sizes="(max-width: 640px) 100vw, 640px"
          class={imgClass}
          figureClass="not-prose"
          creditClass="px-2"
          media={media}
        />
        {caption && (
          <div
            class={cn(
              "text-sm mt-2 px-4 text-gray-700 border-l-gray-800 pb-2",
              captionClass,
            )}
          >
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};
