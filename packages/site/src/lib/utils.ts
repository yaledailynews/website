import type { CollectionItem } from "./types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const getId = (item: CollectionItem | number) => {
  if (typeof item === "number") {
    return item;
  }
  return item.id;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
