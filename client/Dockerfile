# ---- build ----
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

COPY package.json ./
RUN pnpm install --frozen-lockfile=false

COPY . .

# Railway passes these as Docker build args → Vite bake-in
ARG VITE_ACCESS_KEY
ARG VITE_API_BASE_URL

ENV VITE_ACCESS_KEY=$VITE_ACCESS_KEY \
    VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN pnpm run build

# ---- serve ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
