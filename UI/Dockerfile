FROM node:21-alpine AS builder

USER root

RUN mkdir -p /etc/nginx/certs/cloud

WORKDIR /app

COPY . ./UI/

WORKDIR /app/UI
RUN npm install && npm run build

FROM node:21-alpine AS runner

WORKDIR /app/UI
COPY --from=builder /app/UI/.next ./.next
COPY --from=builder /app/UI/public ./public
COPY --from=builder /app/UI/node_modules ./node_modules
COPY --from=builder /app/UI/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
