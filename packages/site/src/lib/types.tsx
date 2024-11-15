import type { Config } from "@cms/payload-types";
import type { FC } from "hono/jsx";

export type Collections = Config["collections"];
export type Collection = keyof Collections;
export type Globals = Config["globals"];
export type Global = keyof Globals;
export type CollectionItem = Collections[Collection];

const emptyFragment = <></>;
export type JSXElement = typeof emptyFragment;

export type SC<Props = {}> = (props: Props) => NonNullable<ReturnType<FC>>;
