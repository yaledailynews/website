import type {
  ArticlesBlock as ArticlesBlockProps,
  Layout,
  Post,
} from "@cms/payload-types";
import { templates } from "./templates";
import type { SC } from "@site/lib/types";

type Props = {
  block: ArticlesBlockProps;
  layout: Layout;
  posts?: Post[];
};

export const ArticlesBlock: SC<Props> = ({ block, posts }) => {
  if (!posts) {
    return <div>No articles</div>;
  }

  const TemplateComponent = templates[block.template];

  return <TemplateComponent block={block} posts={posts} />;
};
