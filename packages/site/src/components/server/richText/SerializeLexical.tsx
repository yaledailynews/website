import type {
  DefaultNodeTypes,
  SerializedBlockNode,
} from "@payloadcms/richtext-lexical";
import type {
  BannerBlock as BannerBlockProps,
  EmbedBlock as EmbedBlockProps,
  MediaBlock as MediaBlockProps,
} from "@cms/payload-types";
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from "./nodeFormat";
import { CMSLink } from "../CMSLink";
import { BannerBlock } from "./blocks/BannerBlock";
import { MediaBlock } from "./blocks/MediaBlock";
import { EmbedBlock } from "./blocks/EmbedBlock";
import type { SC } from "@site/lib/types";

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<MediaBlockProps | BannerBlockProps | EmbedBlockProps>;

type Props = {
  nodes: NodeTypes[];
};

const SerializeChildren: SC<{ node?: NodeTypes | null }> = ({ node }) => {
  if (!node?.children) {
    return <></>;
  } else {
    // NOTE: Hacky fix for
    // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
    // which does not return checked: false (only true - i.e. there is no prop for false)
    if (node?.type === "list" && node?.listType === "check") {
      for (const item of node.children) {
        if ("checked" in item) {
          if (!item?.checked) {
            item.checked = false;
          }
        }
      }
    }
    return <SerializeLexical nodes={node.children as NodeTypes[]} />;
  }
};

export const SerializeLexical: SC<Props> = ({ nodes }) => {
  return (
    <>
      {nodes?.map((node) => {
        if (node == null) {
          return <></>;
        }

        if (node.type === "text") {
          let text = <>{node.text}</>;
          if (node.format & IS_BOLD) {
            text = <strong>{text}</strong>;
          }
          if (node.format & IS_ITALIC) {
            text = <em>{text}</em>;
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span style={{ textDecoration: "line-through" }}>{text}</span>
            );
          }
          if (node.format & IS_UNDERLINE) {
            text = <span style={{ textDecoration: "underline" }}>{text}</span>;
          }
          if (node.format & IS_CODE) {
            text = <code>{node.text}</code>;
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub>{text}</sub>;
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup>{text}</sup>;
          }

          return text;
        }

        if (node.type === "block") {
          const block = node.fields;
          switch (block.blockType) {
            case "mediaBlock":
              return (
                <MediaBlock
                  class="col-start-1 col-span-3"
                  {...block}
                  enableGutter={false}
                />
              );
            case "banner":
              return <BannerBlock class="col-start-2 mb-4" {...block} />;
            case "embed":
              return <EmbedBlock class="col-start-2" {...block} />;
            default:
              return (
                <div class="bg-gray-200 px-4 py-2 text-gray-500">
                  Unsupported block
                </div>
              );
          }
        } else {
          switch (node.type) {
            case "linebreak": {
              return <br class="col-start-2" />;
            }
            case "paragraph": {
              return (
                <p class="col-start-2">
                  <SerializeChildren node={node} />
                </p>
              );
            }
            case "heading": {
              const Tag = node?.tag;
              return (
                <Tag class="col-start-2">
                  <SerializeChildren node={node} />
                </Tag>
              );
            }
            case "list": {
              const Tag = node?.tag;
              return (
                <Tag class="list col-start-2">
                  <SerializeChildren node={node} />
                </Tag>
              );
            }
            case "listitem": {
              if (node?.checked != null) {
                return (
                  <li
                    aria-checked={node.checked ? "true" : "false"}
                    class={` ${node.checked ? "" : ""}`}
                    role="checkbox"
                    tabIndex={-1}
                    value={node?.value}
                  >
                    <SerializeChildren node={node} />
                  </li>
                );
              } else {
                return (
                  <li value={node?.value}>
                    <SerializeChildren node={node} />
                  </li>
                );
              }
            }
            case "quote": {
              return (
                <blockquote class="col-start-2">
                  <SerializeChildren node={node} />
                </blockquote>
              );
            }
            case "link": {
              const fields = node.fields;

              return (
                <CMSLink
                  newTab={Boolean(fields?.newTab)}
                  reference={fields.doc as any}
                  type={fields.linkType === "internal" ? "reference" : "custom"}
                  url={fields.url}
                >
                  <SerializeChildren node={node} />
                </CMSLink>
              );
            }
            case "horizontalrule": {
              return <hr class="col-start-2" />;
            }

            default:
              return <></>;
          }
        }
      })}
    </>
  );
};
