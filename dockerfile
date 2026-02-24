# Stage 1: Build Vite app
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --force

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist ./
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 3005
CMD ["nginx", "-g", "daemon off;"]