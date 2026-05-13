FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/astro.config.ts ./astro.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tailwind.config.mjs ./tailwind.config.mjs

# Instalar curl para healthcheck
RUN apk add --no-cache curl

COPY <<'EOF' /entrypoint.sh
#!/bin/sh
set -e

echo "Waiting for Strapi to be ready..."
for i in $(seq 1 60); do
  if curl -s http://strapi:1337/api/health > /dev/null 2>&1; then
    echo "Strapi is ready! Building landing..."
    npm run build
    echo "Build complete! Starting preview server..."
    exec npm run preview -- --host 0.0.0.0
  fi
  echo "Waiting for Strapi... ($i/60)"
  sleep 2
done

echo "Strapi not available after 60 attempts, starting with placeholder..."
exec npm run preview -- --host 0.0.0.0
EOF

RUN chmod +x /entrypoint.sh

EXPOSE 4321
ENTRYPOINT ["/entrypoint.sh"]
