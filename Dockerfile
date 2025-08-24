

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
WORKDIR /app/client
RUN npm run build

WORKDIR /usr/share/nginx/html
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist/public .
EXPOSE 80
