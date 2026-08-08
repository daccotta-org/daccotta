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
ARG VITE_API_BASE_URL

RUN printf '%s\n' \
  "VITE_ACCESS_KEY=${VITE_ACCESS_KEY}" \
  "VITE_API_BASE_URL=${VITE_API_BASE_URL}" \
  > ./client/.env

RUN pnpm --filter client build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["pnpm", "--filter", "server", "start"]
