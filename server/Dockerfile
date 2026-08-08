FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

COPY package.json ./
RUN pnpm install --frozen-lockfile=false

COPY . .

ENV NODE_ENV=production
EXPOSE 8080

# Railway injects PORT; app uses process.env.PORT || 8080
CMD ["pnpm", "start"]
