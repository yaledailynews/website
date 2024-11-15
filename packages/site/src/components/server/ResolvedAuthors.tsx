import type { Post } from "@cms/payload-types";
import { getDocById } from "@site/lib/cache";
import type { SC } from "@site/lib/types";

type Props = {
  post: Post;
};

export const ResolvedAuthors: SC<Props> = async ({ post }) => {
  if (!post.authors) return <></>;
  const resolvedAuthors = await Promise.all(
    post.authors.map((author) => getDocById("authors", author)),
  );
  return <span>{resolvedAuthors.map((author) => author.name).join(", ")}</span>;
};
