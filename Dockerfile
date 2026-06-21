# syntax=docker/dockerfile:1.7

FROM node:22.13.0-alpine AS builder

ENV CI=true \
    PNPM_HOME=/root/.local/share/pnpm \
    PATH=/root/.local/share/pnpm:$PATH

RUN corepack enable

WORKDIR /app

COPY pnpm-lock.yaml package.json .npmrc ./

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm build \
    && rm -rf node_modules .svelte-kit

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

USER root
RUN rm -f /etc/nginx/conf.d/default.conf

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx /app/build /usr/share/nginx/html

RUN chmod -R a-w /usr/share/nginx/html \
    && chmod -R u=rwX,go=rX /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
