import type { TextBlock as TextBlockProps, Layout } from "@cms/payload-types";
import RichText from "@site/components/server/richText/RichText";
import type { SC } from "@site/lib/types";

type Props = {
  block: TextBlockProps;
  layout: Layout;
};

export const TextBlock: SC<Props> = ({ block }) => {
  return (
    <div>
      <RichText content={block.text} font="serif" size="lg" black />
    </div>
  );
};
