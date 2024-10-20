import { Post } from "@/payload-types";
import Link from "next/link";

export function PostItem({
  post,
  size = "lg",
  hideSummary = false,
}: {
  post: Post;
  hideSummary?: boolean;
  size?: "2xl" | "xl" | "lg" | "md" | "sm" | "base";
}) {
  const titleSizeClass = {
    "2xl": "text-2xl",
    xl: "text-2xl md:text-xl",
    lg: "text-xl md:text-lg",
    md: "text-xl md:text-lg",
    base: "text-xl md:text-lg",
    sm: "text-lg md:text-sm",
  }[size];

  const gapSizeClass = {
    "2xl": "gap-2.5",
    xl: "gap-2.5 sm:gap-2",
    lg: "gap-2 sm:gap-1.5",
    md: "gap-1.5 sm:gap-1",
    base: "gap-1.5 sm:gap-1",
    sm: "gap-1.5 sm:gap-1",
  }[size];

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="hover:opacity-70 transition-opacity"
    >
      <article className="flex flex-col gap-3">
        <div className={`flex flex-col gap-1 ${gapSizeClass}`}>
          <h1 className={`font-headline ${titleSizeClass}`}>{post.title}</h1>

          {post.subhead && !hideSummary && (
            <p className="font-serif text-gray-600 text-base md:text-sm">
              {post.subhead}
            </p>
          )}
        </div>
        <div className="flex gap-3 items-center">
          {/* {post.tag && (
            <span className="text-sky-700 bg-sky-100 px-2 py-0.5 text-xs self-start">
              {post.tag.name}
            </span>
          )} */}
          <p className="text-gray-500 text-xs">
            By {post.populatedAuthors?.map((author) => author.name).join(", ")}
          </p>
        </div>
      </article>
    </Link>
  );
}
