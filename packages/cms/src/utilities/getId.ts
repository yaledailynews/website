import { Config } from '@cms/payload-types'

export type CollectionItem = Config['collections'][keyof Config['collections']];

export const getId = (item: CollectionItem | number) => {
  if (typeof item === 'number') {
    return item;
  }
  return item.id;
}