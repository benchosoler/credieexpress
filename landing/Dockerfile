FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

RUN apk add --no-cache curl && \
    chmod +x /app/entrypoint.sh

EXPOSE 4321
ENTRYPOINT ["/app/entrypoint.sh"]
