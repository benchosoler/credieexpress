FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/. ./
COPY --from=build /app/build ./build
COPY --from=build /app/src ./src
COPY --from=build /app/public ./public
COPY --from=build /app/config ./config
COPY --from=build /app/types ./types
EXPOSE 1337
CMD ["npm", "run", "start"]
