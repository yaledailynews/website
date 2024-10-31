import { getDocById } from '@/utilities/cache'
import { type Tag } from '@payload-types'
import colors from 'tailwindcss/colors'

export async function Tag({ tag }: { tag: Tag | number }) {
  const resolvedTag = await getDocById('tags', tag)()
  const color = resolvedTag.color ? colors[resolvedTag.color] : colors.gray
  return (
    <span
      className="px-2.5 py-[3px] text-xs font-medium text-white"
      style={{
        border: `1px solid ${color[700]}`,
        backgroundColor: resolvedTag.style === "solid" ? color[700] : color[100],
        color: resolvedTag.style === "solid" ? "white" : color[700],
      }}
    >
      {resolvedTag.title}
    </span>
  )
}
