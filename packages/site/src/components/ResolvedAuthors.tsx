import type { Post } from "@cms/payload-types";
import { getDocById } from "@site/lib/cache";

export async function ResolvedAuthors({ post }: { post: Post }) {
  if (!post.authors) return <></>;
  const resolvedAuthors = await Promise.all(
    post.authors.map((author) => getDocById("authors", author)),
  );
  return <span>{resolvedAuthors.map((author) => author.name).join(", ")}</span>;
}
