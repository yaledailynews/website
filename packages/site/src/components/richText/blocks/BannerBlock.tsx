import type { BannerBlock as BannerBlockProps } from "@cms/payload-types";
import { cn } from "@site/lib/utils";
import type { FC } from "hono/jsx";
import RichText from "../RichText";

type Props = {
  class?: string;
} & BannerBlockProps;

export const BannerBlock: FC<Props> = ({
  class: className,
  content,
  style,
}) => {
  return (
    <div class={cn("mx-auto my-8 w-full", className)}>
      <div
        class={cn("border py-1 px-6 flex items-center", {
          "border-sky-300 bg-sky-50": style === "info",
          "border-rose-300 bg-rose-50": style === "error",
          "border-green-300 bg-green-50": style === "success",
          "border-amber-300 bg-amber-50": style === "warning",
        })}
      >
        <RichText content={content} font="sans" size="md" />
      </div>
    </div>
  );
};
