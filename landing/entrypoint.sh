#!/bin/sh
set -e

export PUBLIC_STRAPI_URL="${PUBLIC_STRAPI_URL:-http://strapi:1337}"

echo "PUBLIC_STRAPI_URL=${PUBLIC_STRAPI_URL}" > .env
echo "Built with PUBLIC_STRAPI_URL=${PUBLIC_STRAPI_URL}"

echo "Waiting for Strapi at $PUBLIC_STRAPI_URL..."
for i in $(seq 1 90); do
  if curl -sf "${PUBLIC_STRAPI_URL}/_health" > /dev/null 2>&1 || curl -sf "${PUBLIC_STRAPI_URL}/" > /dev/null 2>&1; then
    echo "Strapi is ready! Building landing..."
    PUBLIC_STRAPI_URL=${PUBLIC_STRAPI_URL} npx astro build
    echo "Build complete! Starting preview server..."
    exec npm run preview -- --host 0.0.0.0
  fi
  echo "Waiting for Strapi... ($i/90)"
  sleep 2
done

echo "Strapi not available after 90 attempts, building with placeholder..."
PUBLIC_STRAPI_URL=${PUBLIC_STRAPI_URL} npx astro build
exec npm run preview -- --host 0.0.0.0
