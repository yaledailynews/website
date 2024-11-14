import type { Config } from "@cms/payload-types";

export type Collections = Config["collections"];
export type Collection = keyof Collections;
export type Globals = Config["globals"];
export type Global = keyof Globals;
export type CollectionItem = Collections[Collection];
