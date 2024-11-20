import { CollectionSlug } from "payload";

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: "/posts",
  layouts: "/layouts",
  pages: "",
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  id: number;
};

export const generatePreviewPath = ({ collection, id }: Props) => {
  const path = `${collectionPrefixMap[collection]}/${id}`;

  const params = {
    id,
    collection,
    path,
  };

  const encodedParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    encodedParams.append(key, value.toString());
  });

  return `/next/preview?${encodedParams.toString()}`;
};
