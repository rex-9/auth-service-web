# rexone-web/Dockerfile
# Multi-stage production build for Rexone Web

# ============================================================
# Stage 1: Build static assets
# ============================================================
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first for better Docker cache utilization
COPY package*.json ./
RUN npm ci

# Pass Vite environment build arguments
ARG VITE_REACT_APP_NAME="rexone.me"
ARG VITE_REACT_APP_GOOGLE_CLIENT_ID=""
ARG VITE_REACT_APP_GOOGLE_CLIENT_SECRET=""
ARG VITE_REACT_APP_SERVER_BASE_URL="https://api.rexone.me"
ARG VITE_REACT_APP_CLIENT_BASE_URL="https://rexone.me"
ARG VITE_REACT_APP_SERVER_WS_BASE_URL="wss://api.rexone.me"
ARG VITE_MEDIA_MAX_NON_VIDEO_SIZE_MB="10"
ARG VITE_MEDIA_MAX_VIDEO_SIZE_MB="100"
ARG VITE_MEDIA_MAX_FILE_COUNT="20"

ENV VITE_REACT_APP_NAME=$VITE_REACT_APP_NAME \
    VITE_REACT_APP_GOOGLE_CLIENT_ID=$VITE_REACT_APP_GOOGLE_CLIENT_ID \
    VITE_REACT_APP_GOOGLE_CLIENT_SECRET=$VITE_REACT_APP_GOOGLE_CLIENT_SECRET \
    VITE_REACT_APP_SERVER_BASE_URL=$VITE_REACT_APP_SERVER_BASE_URL \
    VITE_REACT_APP_CLIENT_BASE_URL=$VITE_REACT_APP_CLIENT_BASE_URL \
    VITE_REACT_APP_SERVER_WS_BASE_URL=$VITE_REACT_APP_SERVER_WS_BASE_URL \
    VITE_MEDIA_MAX_NON_VIDEO_SIZE_MB=$VITE_MEDIA_MAX_NON_VIDEO_SIZE_MB \
    VITE_MEDIA_MAX_VIDEO_SIZE_MB=$VITE_MEDIA_MAX_VIDEO_SIZE_MB \
    VITE_MEDIA_MAX_FILE_COUNT=$VITE_MEDIA_MAX_FILE_COUNT \
    NODE_ENV=production

# Copy source code and build
COPY . .
RUN npm run build

# ============================================================
# Stage 2: Serve via high-performance Nginx
# ============================================================
FROM nginx:alpine AS runtime

# Copy built distribution files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA routing and gzip
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
