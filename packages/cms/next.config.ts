import type { NextConfig } from "next";

import { withPayload } from "@payloadcms/next/withPayload";
import redirects from "./redirects";

function assertValidProtocol(protocol: string): protocol is "https" | "http" {
  return protocol === "https" || protocol === "http";
}
function getUrlProtocol(url: string): "https" | "http" {
  const protocol = new URL(url).protocol.split(":")[0];
  if (!assertValidProtocol(protocol)) {
    throw new Error(`Invalid protocol: ${protocol}`);
  }
  return protocol;
}

const SERVER_URL = process.env.SERVER_URL;
if (!SERVER_URL) {
  throw new Error("Missing SERVER_URL");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...[SERVER_URL].map((item) => {
        const url = new URL(item);
        return {
          hostname: url.hostname,
          protocol: getUrlProtocol(item),
        };
      }),
    ],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "@lexical/react/LexicalComposer": "@lexical/react/LexicalComposer.mjs",
      },
    },
  },
  reactStrictMode: true,
  redirects,
};

export default withPayload(nextConfig);
