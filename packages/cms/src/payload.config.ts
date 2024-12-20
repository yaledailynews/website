import { s3Storage } from "@payloadcms/storage-s3";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
  SuperscriptFeature,
  SubscriptFeature,
} from "@payloadcms/richtext-lexical";
import { UnderlineFeature } from "@payloadcms/richtext-lexical";
import { resendAdapter } from "@payloadcms/email-resend";

import path from "path";
import sharp from "sharp"; // editor-import
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Users } from "./collections/Users";
import { Authors } from "./collections/Authors";
import { Layouts } from "./collections/Layouts";

import { Footer } from "./globals/Footer";
import { Header } from "./globals/Header";
import { Settings } from "./globals/Settings";

import { Tags } from "./collections/Tags";

import { z } from "zod";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const env = z
  .object({
    DATABASE_URL: z.string().url(),
    SERVER_URL: z.string().url(),
    PAYLOAD_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    S3_ENDPOINT: z.string().url(),
    S3_REGION: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
  })
  .parse(process.env);

export default buildConfig({
  admin: {
    meta: {
      titleSuffix: " - YDN",
      title: "Yale Daily News CMS",
      description:
        "The content management system for the Yale Daily News website.",
      icons: [
        {
          url: "/favicon.ico",
          type: "image/x-icon",
        },
        {
          url: "/icon.png",
          type: "image/png",
        },
      ],
    },
    components: {
      beforeLogin: ["@cms/components/BeforeLogin"],
      beforeDashboard: ["@cms/components/BeforeDashboard"],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        SuperscriptFeature(),
        SubscriptFeature(),
        LinkFeature({
          enabledCollections: ["pages", "posts"],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ("name" in field && field.name === "url") return false;
              return true;
            });

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: "url",
                type: "text",
                admin: {
                  condition: ({ linkType }) => linkType !== "internal",
                },
                label: ({ t }) => t("fields:enterURL"),
                required: true,
              },
            ];
          },
        }),
      ];
    },
  }),
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URL,
    },
    migrationDir: path.resolve(dirname, "migrations"),
    push: false,
  }),
  collections: [Pages, Posts, Media, Categories, Users, Authors, Layouts, Tags],
  cors: [env.SERVER_URL],
  csrf: [env.SERVER_URL],
  globals: [Settings, Header, Footer],
  plugins: [
    nestedDocsPlugin({
      collections: ["categories"],
    }),
    s3Storage({
      collections: {
        media: {
          disableLocalStorage: true,
          // disablePayloadAccessControl: true,
        },
      },
      config: {
        endpoint: env.S3_ENDPOINT,
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
        region: env.S3_REGION,
      },
      bucket: env.S3_BUCKET,
    }),
  ],
  secret: env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  email: resendAdapter({
    defaultFromAddress: "noreply@admin.yaledailynews2.com",
    defaultFromName: "Yale Daily News Admin",
    apiKey: env.RESEND_API_KEY,
  }),
});
