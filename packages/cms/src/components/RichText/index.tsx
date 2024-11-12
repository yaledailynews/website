import { cn } from '@/utilities/cn'
import React from 'react'

import { serializeLexical } from './serialize'

type Props = {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
  font: "serif" | "sans";
  size: "xs" | "sm" | "md" | "lg";
  black?: boolean;
};

const RichText: React.FC<Props> = ({ className, content, font, size, black }) => {
  if (!content) {
    return null
  }

  return (
    <div
      className={cn(
        "prose w-full prose-a:text-sky-800 prose-p:leading-normal prose-p:tracking-normal prose-a:underline-offset-2 prose-a:decoration-sky-700",
        {
          "font-serif": font === "serif",
          "font-sans": font === "sans",
        },
        {
          "prose-p:text-gray-900": black,
        },
        {
          "prose-lg md:prose-xl": size === "lg",
          "prose-base md:prose-lg": size === "md",
          "prose-sm md:prose-base": size === "sm",
          "prose-sm": size === "xs",
        },
        className
      )}
    >
      {content &&
        !Array.isArray(content) &&
        typeof content === 'object' &&
        'root' in content &&
        serializeLexical({ nodes: content?.root?.children })}
    </div>
  )
}

export default RichText
