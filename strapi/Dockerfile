FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config
COPY --from=builder /app/types ./types
COPY --from=builder /app/package.json ./

RUN apk add --no-cache curl

EXPOSE 1337
CMD ["npm", "run", "start"]
