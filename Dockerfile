FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN pnpm install --frozen-lockfile

COPY . .

# Optional Vite env bake-in for combined image builds
ARG VITE_ACCESS_KEY
ARG VITE_ACCESS_TOKEN_SECRET
ARG VITE_TMDB_API
ARG VITE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_APP_ID

RUN printf '%s\n' \
  "VITE_ACCESS_KEY=${VITE_ACCESS_KEY}" \
  "VITE_ACCESS_TOKEN_SECRET=${VITE_ACCESS_TOKEN_SECRET}" \
  "VITE_TMDB_API=${VITE_TMDB_API}" \
  "VITE_API_KEY=${VITE_API_KEY}" \
  "VITE_AUTH_DOMAIN=${VITE_AUTH_DOMAIN}" \
  "VITE_PROJECT_ID=${VITE_PROJECT_ID}" \
  "VITE_STORAGE_BUCKET=${VITE_STORAGE_BUCKET}" \
  "VITE_MESSAGING_SENDER_ID=${VITE_MESSAGING_SENDER_ID}" \
  "VITE_APP_ID=${VITE_APP_ID}" \
  > ./client/.env

RUN pnpm --filter client build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["pnpm", "--filter", "server", "start"]
