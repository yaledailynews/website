# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1
WORKDIR /usr/src/app

COPY . .
RUN bun install

WORKDIR /usr/src/app/cms
ENV NODE_ENV=production
RUN bun run build

# run the app
USER bun
EXPOSE 8080/tcp
ENTRYPOINT [ "bun", "run", "start" ]
