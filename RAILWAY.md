# Railway Hosting Plan — Daccotta

Complete plan to host Daccotta on Railway: backend (Node.js + Express), frontend (Vite + React), and MongoDB.

---

## Architecture

Use **3 separate Railway services** in one project:

```text
┌─────────────────────┐     VITE_API_BASE_URL      ┌─────────────────────┐
│  frontend (static)  │ ─────────────────────────► │  backend (Node API)  │
│  client/dist        │     HTTPS public URL       │  server/            │
└─────────────────────┘                            └──────────┬──────────┘
                                                              │ MONGO_URL
                                                              │ (private network)
                                                              ▼
                                                   ┌─────────────────────┐
                                                   │  MongoDB            │
                                                   │  Railway DB / mongo │
                                                   └─────────────────────┘
```

| Service    | Role                         | Public? | Source              |
| ---------- | ---------------------------- | ------- | ------------------- |
| `backend`  | Express API                  | Yes     | `server/`           |
| `frontend` | Static Vite build            | Yes     | `client/`           |
| `mongodb`  | Database                     | No*     | Railway Mongo / image |

\*Keep Mongo private (Railway internal network only).

Do **not** use the root `Dockerfile` for production. It builds the client but the server never serves `client/dist`, so a single combined service will not work without extra code.

---

## Prerequisites (code changes before deploy)

### 1. better-auth env vars on Railway

Auth uses [better-auth](https://www.better-auth.com/) (no Firebase). Set on the **backend** service:

| Variable | Notes |
| -------- | ----- |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Public backend URL, e.g. `https://<backend>.up.railway.app` |
| `CLIENT_URL` | Public frontend URL, e.g. `https://<frontend>.up.railway.app` |
| `MONGO_URL` | Mongo connection string |

### 2. Frontend API URL

Client uses `VITE_API_BASE_URL` (see `client/src/lib/config.ts`). Set this to the Railway backend public URL **at build time** (Vite inlines `VITE_*` vars).

### 3. CORS

Server CORS is restricted to `CLIENT_URL` and exposes `set-auth-token` for bearer sessions.

---

## Proposed Dockerfiles

Add these files (recommended). Existing root `Dockerfile` can stay unused for Railway.

### `server/Dockerfile` (replace / tighten)

```dockerfile
FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

COPY package.json ./
RUN pnpm install --frozen-lockfile=false

COPY . .

ENV NODE_ENV=production
EXPOSE 8080

# Railway injects PORT; app already uses process.env.PORT || 8080
CMD ["pnpm", "start"]
```

### `server/.dockerignore`

```text
node_modules
.env
.git
*.md
```

### `client/Dockerfile` (for static frontend)

Multi-stage: build with Node/pnpm, serve with nginx.

```dockerfile
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
```

### `client/nginx.conf`

SPA fallback so React Router works:

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 7d;
    add_header Cache-Control "public";
  }
}
```

### `client/.dockerignore`

```text
node_modules
dist
.env
.env.*
!.env.example
.git
*.md
```

### MongoDB

Prefer **Railway’s MongoDB database template** (no custom Dockerfile).

If you insist on the official image:

- Image: `mongo:7`
- Volume mount: `/data/db`
- Do not expose publicly unless required

---

## Service-by-service deployment

### Service A — MongoDB

**Option A (recommended): Railway Database**

1. Railway project → **New** → **Database** → **MongoDB**.
2. Wait until healthy.
3. Copy the connection variable (often `MONGO_URL` or similar).
4. Prefer the **private** network URL for the backend.

**Option B: Docker image**

1. New service → Docker Image → `mongo:7`.
2. Add volume → mount `/data/db`.
3. Backend `MONGO_URL`:

```text
mongodb://<mongodb-service-host>:27017/daccotta
```

Use Railway’s internal hostname for that service.

---

### Service B — Backend (`server`)

| Setting              | Value                          |
| -------------------- | ------------------------------ |
| Source               | Same GitHub repo               |
| Root Directory       | `server`                       |
| Builder              | Dockerfile                     |
| Dockerfile path      | `Dockerfile`                   |
| Watch paths          | `/server`                      |
| Public networking    | Enable (generate domain)       |
| Healthcheck (optional) | `GET /ping`                  |

**Environment variables**

| Variable             | Value                                   |
| -------------------- | --------------------------------------- |
| `MONGO_URL`          | `${{MongoDB.MONGO_URL}}` (or paste URL) |
| `NODE_ENV`           | `production`                            |
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL`    | `https://<backend>.up.railway.app`      |
| `CLIENT_URL`         | `https://<frontend>.up.railway.app`     |
| `PORT`               | Leave unset (Railway sets it)           |

**Start command:** already in Dockerfile → `pnpm start`

**Verify**

```text
https://<backend>.up.railway.app/ping
→ Server is alive

https://<backend>.up.railway.app/api/hello
→ Hello World!
```

---

### Service C — Frontend (`client`)

| Setting         | Value                    |
| --------------- | ------------------------ |
| Source          | Same GitHub repo         |
| Root Directory  | `client`                 |
| Builder         | Dockerfile               |
| Dockerfile path | `Dockerfile`             |
| Watch paths     | `/client`                |
| Public networking | Enable                 |

**Build args / variables** (must be available at **build** time)

| Variable            | Example / notes                                      |
| ------------------- | ---------------------------------------------------- |
| `VITE_API_BASE_URL` | `https://<backend>.up.railway.app` (no trailing `/`) |
| `VITE_ACCESS_KEY`   | TMDB API key                                         |

On Railway Dockerfile deploys, mark these as available for build (or pass as Docker build args). After changing `VITE_API_BASE_URL`, **redeploy frontend**.

**Alternative without Docker:** Railway Static Site

| Setting        | Value            |
| -------------- | ---------------- |
| Root Directory | `client`         |
| Install        | `pnpm install`    |
| Build          | `pnpm run build` |
| Output dir     | `dist`           |

Same `VITE_*` env vars required at build time.

---

## Recommended Railway project layout

```text
Project: daccotta
├── mongodb     (Database / mongo:7 + volume)
├── backend     (Root: server, Dockerfile)
└── frontend    (Root: client, Dockerfile or Static)
```

Link variables:

```text
backend.MONGO_URL = ${{mongodb.MONGO_URL}}
frontend.VITE_API_BASE_URL = https://backend-production-xxxx.up.railway.app
```

Deploy order:

1. MongoDB  
2. Backend (confirm `/ping`)  
3. Frontend (with backend URL baked in)

---

## Local Docker Mongo (dev only)

Not used by Railway. For local development only:

```bash
docker run -d --name daccotta-mongo -p 27017:27017 mongo:7
```

`server/.env`:

```env
MONGO_URL=mongodb://127.0.0.1:27017/daccotta
NODE_ENV=development
BETTER_AUTH_SECRET=dev-secret-change-me
BETTER_AUTH_URL=http://localhost:8080
CLIENT_URL=http://localhost:5173
```

---

## Auth checklist (better-auth)

1. Generate `BETTER_AUTH_SECRET` (`openssl rand -base64 32`).
2. Set `BETTER_AUTH_URL` to the public backend URL.
3. Set `CLIENT_URL` to the public frontend URL (CORS + trustedOrigins).
4. Frontend only needs `VITE_API_BASE_URL` + `VITE_ACCESS_KEY` at build time.

---

## Custom domains (optional)

1. Backend: `api.yourdomain.com` → backend service.
2. Frontend: `yourdomain.com` → frontend service.
3. Update `VITE_API_BASE_URL` to `https://api.yourdomain.com` and redeploy frontend.
4. Update `BETTER_AUTH_URL` / `CLIENT_URL` on the backend to match.

---

## What not to deploy

| Item                         | Why                                      |
| ---------------------------- | ---------------------------------------- |
| Root `Dockerfile` as one app | Builds client but never serves it        |
| Public Mongo port            | Unnecessary exposure                     |
| Atlas URL on Railway         | Optional; Railway Mongo is enough        |

---

## Post-deploy smoke test

- [ ] `GET /ping` on backend → alive  
- [ ] `GET /api/hello` → Hello World  
- [ ] Backend logs show Mongo connected  
- [ ] Backend logs show Firebase Admin initialized  
- [ ] Frontend loads over HTTPS  
- [ ] Login / signup works (Firebase)  
- [ ] Create list / journal entry (writes to Mongo)  
- [ ] Network tab shows API calls to Railway backend, not `localhost`

---

## Cost / ops notes

- Railway free/trial limits apply; Mongo + 2 web services count separately.
- Attach a volume if you self-host `mongo:7`; Railway’s managed Mongo handles persistence for you.
- Backend has a `keepAlive` ping utility (legacy Render cold-start). On Railway it is usually unnecessary but harmless.
- After every backend URL change, rebuild frontend so `VITE_API_BASE_URL` updates.

---

## Minimal implementation todo (in repo)

1. ~~Migrate auth from Firebase to better-auth.~~ Done  
2. ~~Replace/tighten `server/Dockerfile` + add `.dockerignore`.~~ Done  
3. ~~Add `client/Dockerfile`, `client/nginx.conf`, `client/.dockerignore`.~~ Done  
4. (Optional) Delete or ignore root `Dockerfile` for Railway docs to avoid confusion.  
5. Deploy Mongo → backend → frontend as above.

Railway setup from here is configuration only: root directories, env vars, and domains.
