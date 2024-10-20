import { ArticlesBlock, Post } from '@/payload-types'
import { FeaturedPair } from './FeaturedPair'
import { TemplateName } from '../config'
import React from 'react'

export type TemplateProps = {
  block: ArticlesBlock
  posts: Post[]
}

export const templates: Record<TemplateName, React.FC<TemplateProps>> = {
  FeaturedPair,
  FeaturedSingle: () => <div>Featured Single</div>,
  LargeImageQuad: () => <div>Large Image Quad</div>,
  Magazine: () => <div>Magazine</div>,
  Opinion: () => <div>Opinion</div>,
  SidebarTrio: () => <div>Sidebar Trio</div>,
  SmallImageTrio: () => <div>Small Image Trio</div>,
  TallImageTrio: () => <div>Tall Image Trio</div>,
  TwoColumnQuad: () => <div>Two Column Quad</div>,
  SimpleList: () => <div>Simple List</div>,
  WKND: () => <div>WKND</div>,
}
