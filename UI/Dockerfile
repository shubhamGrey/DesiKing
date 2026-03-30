FROM node:21-alpine AS builder

USER root

RUN mkdir -p /etc/nginx/certs/cloud

WORKDIR /app/UI

# Copy package files first so npm install layer is cached when only source changes
COPY package.json package-lock.json ./

# BuildKit cache mount keeps the npm cache between builds on the VPS
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM node:21-alpine AS runner

WORKDIR /app/UI
COPY --from=builder /app/UI/.next ./.next
COPY --from=builder /app/UI/public ./public
COPY --from=builder /app/UI/package.json ./package.json
COPY --from=builder /app/UI/package-lock.json ./package-lock.json

# Install production dependencies only (smaller image, faster copy)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
