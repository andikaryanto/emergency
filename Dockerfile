## syntax=docker/dockerfile:1.6
FROM node:20-alpine AS deps

WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN if [ -f package-lock.json ]; then \
      npm ci; \
    elif [ -f yarn.lock ]; then \
      corepack enable && yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then \
      corepack enable && pnpm install --frozen-lockfile; \
    else \
      npm install; \
    fi

FROM node:20-alpine AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

ARG APP_NAME="Klinik RME"
ARG APP_URL
ARG API_URL
ARG TENANT_BASE_DOMAIN
ARG API_TIMEOUT_MS="10000"
ARG APP_ENV="staging"

ENV APP_NAME=${APP_NAME}
ENV APP_URL=${APP_URL}
ENV API_URL=${API_URL}
ENV TENANT_BASE_DOMAIN=${TENANT_BASE_DOMAIN}
ENV API_TIMEOUT_MS=${API_TIMEOUT_MS}
ENV APP_ENV=${APP_ENV}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public

RUN if [ -f package-lock.json ]; then \
      npm run build; \
    elif [ -f yarn.lock ]; then \
      corepack enable && yarn build; \
    elif [ -f pnpm-lock.yaml ]; then \
      corepack enable && pnpm build; \
    else \
      npm run build; \
    fi

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ARG APP_NAME="Klinik RME"
ARG APP_URL
ARG API_URL
ARG TENANT_BASE_DOMAIN
ARG API_TIMEOUT_MS="10000"
ARG APP_ENV="staging"

ENV APP_NAME=${APP_NAME}
ENV APP_URL=${APP_URL}
ENV API_URL=${API_URL}
ENV TENANT_BASE_DOMAIN=${TENANT_BASE_DOMAIN}
ENV API_TIMEOUT_MS=${API_TIMEOUT_MS}
ENV APP_ENV=${APP_ENV}
RUN apk add --no-cache libc6-compat
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
