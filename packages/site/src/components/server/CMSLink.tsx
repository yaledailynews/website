import type { Author, Category, Page, Post } from "@cms/payload-types";
import { getDocById } from "@site/lib/cache";
import type { SC } from "@site/lib/types";
import type { PropsWithChildren } from "hono/jsx";

type CMSLinkType = PropsWithChildren<{
  class?: string;
  label?: string | null;
  newTab?: boolean | null;
  reference?: {
    relationTo: "pages" | "posts" | "authors" | "categories";
    value: Page | Post | Author | Category | number;
  } | null;
  type?: "custom" | "reference" | null;
  url?: string | null;
}>;

export const CMSLink: SC<CMSLinkType> = async ({
  type,
  children,
  class: className,
  label,
  newTab,
  reference,
  url,
}) => {
  const href =
    type === "reference" && reference
      ? `${reference.relationTo !== "pages" ? `/${reference.relationTo}` : ""}/${
          (await getDocById(reference.relationTo, reference.value)).slug
        }`
      : url;

  if (!href) return <a class={className}>{children}</a>;

  const newTabProps = newTab
    ? { rel: "noopener noreferrer", target: "_blank" }
    : {};

  return (
    <a class={className} href={href || url || ""} {...newTabProps}>
      {label && label}
      {children && children}
    </a>
  );
};
