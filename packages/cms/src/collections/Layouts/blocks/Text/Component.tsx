import RichText from '@cms/components/RichText'
import { TextBlock as TextBlockProps, Layout } from '@cms/payload-types'

export async function TextBlock({ block, layout }: {
  block: TextBlockProps
  layout: Layout
}) {
  return (
    <div>
      <RichText content={block.text} font="serif" size="lg" black />
    </div>
  );
}
