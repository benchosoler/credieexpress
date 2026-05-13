FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
EXPOSE 4321
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
