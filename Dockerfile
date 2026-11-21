# syntax=docker/dockerfile:1

# ---- deps: install node_modules once, shared by dev and build ----
FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- dev: `docker compose up dev` — live reload on http://localhost:1111 ----
FROM deps AS dev
ENV DOCKER_DEV=true
COPY . .
EXPOSE 1111
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "1111"]

# ---- build: the static site in /app/dist ----
FROM deps AS build
ARG SITE_URL=http://localhost:8080
ENV SITE_URL=${SITE_URL}
COPY . .
RUN npm run build

# ---- runtime: nginx serving the static site on port 80 ----
FROM nginx:1.27-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
