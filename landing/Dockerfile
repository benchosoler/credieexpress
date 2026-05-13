FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

RUN apk add --no-cache curl && \
    chmod +x /entrypoint.sh

EXPOSE 4321
ENTRYPOINT ["/entrypoint.sh"]
