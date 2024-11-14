// import { Button, type ButtonProps } from '@cms/components/ui/button'
import { cn } from '@cms/utilities/cn'
import Link from 'next/link'
import React from 'react'

import type { Author, Category, Page, Post } from '@cms/payload-types'
import { getDocById } from '@cms/utilities/cache'

type CMSLinkType = {
  appearance?: 'inline' // | 'button'
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'authors' | 'categories'
    value: Page | Post | Author | Category | number
  } | null
  // size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = async (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    // size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && reference
      ? `${reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''}/${
          (await getDocById(reference.relationTo, reference.value)()).slug
        }`
      : url

  if (!href) return null

  // const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  // return (
  //   <Button asChild className={className} size={size} variant={appearance}>
  //     <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
  //       {label && label}
  //       {children && children}
  //     </Link>
  //   </Button>
  // )
}
