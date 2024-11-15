import type { ArticlesBlock, Post } from "@cms/payload-types";

import { FeaturedPair } from "./FeaturedPair";
import { FeaturedSingle } from "./FeaturedSingle";
import { LargeImageQuad } from "./LargeImageQuad";
import { Magazine } from "./Magazine";
import { Opinion } from "./Opinion";
import { SidebarTrio } from "./SidebarTrio";
import { SimpleList } from "./SimpleList";
import { SmallImageTrio } from "./SmallImageTrio";
import { TallImageTrio } from "./TallImageTrio";
import { TwoColumnQuad } from "./TwoColumnQuad";
import { WKND } from "./WKND";
import type { SC } from "@site/lib/types";

type TemplateName = ArticlesBlock["template"];

export type TemplateProps = {
  block: ArticlesBlock;
  posts: Post[];
};

export const templates: Record<TemplateName, SC<TemplateProps>> = {
  FeaturedPair,
  FeaturedSingle,
  LargeImageQuad,
  Magazine,
  Opinion,
  SidebarTrio,
  SmallImageTrio,
  TallImageTrio,
  TwoColumnQuad,
  SimpleList,
  WKND,
};
