import type { TextBlock as TextBlockProps, Layout } from "@cms/payload-types";
import RichText from "@site/components/richText/RichText";

export async function TextBlock({
  block,
}: {
  block: TextBlockProps;
  layout: Layout;
}) {
  return (
    <div>
      <RichText content={block.text} font="serif" size="lg" black />
    </div>
  );
}
