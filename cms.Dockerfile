# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.1.34  AS bun-base
FROM node:20.11.1 AS node-base

WORKDIR /usr/src/app

COPY . .
RUN bun install

WORKDIR /usr/src/app/packages/cms
ENV NODE_ENV=production

ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG S3_ENDPOINT
ARG S3_ACCESS_KEY_ID
ARG S3_BUCKET
ARG S3_REGION
ARG S3_SECRET_ACCESS_KEY
ARG RESEND_API_KEY
ARG OPENAI_API_KEY
ARG MEILI_URL
ARG MEILI_ADMIN_KEY
ARG VITE_MEILI_SEARCH_KEY
ARG VITE_MEILI_SEARCH_INDEX
ARG SERVER_URL
ARG CLOUDFLARE_ZONE_ID
ARG CLOUDFLARE_API_KEY
ARG SITE_HOST
ARG SITE_URL
ARG DRAFT_SECRET

RUN bun run build

RUN chown -R bun:bun /usr/src/app/packages/cms

# run the app
USER bun
EXPOSE 8080/tcp
ENTRYPOINT [ "bun", "run", "start" ]
