# ───────── Stage 1: Build Frontend ─────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project source files
COPY . .

# Set production API URL during build (can be overridden via build-arg)
ARG VITE_API_URL=https://api.dqnex.online
ENV VITE_API_URL=${VITE_API_URL}

# Build production bundle
RUN npm run build

# ───────── Stage 2: Serve with Nginx ─────────
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
