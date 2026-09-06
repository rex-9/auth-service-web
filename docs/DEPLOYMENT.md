# Rexone Web: Production Deployment Guide

> **Target Platform:** Coolify + Nginx on Contabo VPS  
> **Container:** Multi-stage Dockerfile (`node:22-alpine` build + `nginx:alpine` runtime)  
> **Port:** 80 (Internal) / 443 (Traefik SSL edge)

---

## 1. Production Architecture

The web application is packaged into a high-performance, minimal static container using `nginx:alpine`:
- Static React SPA assets are served directly from `/usr/share/nginx/html`.
- SPA deep links fallback cleanly to `/index.html` via `try_files $uri $uri/ /index.html;`.
- Static assets (`.js`, `.css`, fonts, images) are compressed with `gzip` and cached for 1 year with immutable cache headers.
- Total memory footprint: **~15MB RAM** (versus 300MB+ for Node.js development server).

---

## 2. Coolify Deployment Steps

1. In Coolify, navigate to your **`prod-rexone`** (or `uat-rexone`) Project.
2. Click **New Resource** → **Docker Compose Application** (or Git Repository).
3. Set the repository URL to `rexone-web` and branch to `main` (or `dev` for UAT).
4. Compose File Path: `docker-compose.yaml`.
5. Under **Environment Variables**, provide the build arguments:

| Variable | Production Value | UAT Value |
| :--- | :--- | :--- |
| `WEB_CONTAINER_NAME` | `prod-rexone-web` | `uat-rexone-web` |
| `DOCKER_NETWORK` | `prod-rexone-net` | `uat-rexone-net` |
| `VITE_REACT_APP_NAME` | `rexone.me` | `uat.rexone.me` |
| `VITE_REACT_APP_SERVER_BASE_URL` | `https://api.rexone.me` | `https://api-uat.rexone.me` |
| `VITE_REACT_APP_CLIENT_BASE_URL` | `https://rexone.me` | `https://uat.rexone.me` |
| `VITE_REACT_APP_SERVER_WS_BASE_URL` | `wss://api.rexone.me` | `wss://api-uat.rexone.me` |
| `VITE_REACT_APP_GOOGLE_CLIENT_ID` | `<Google_Client_ID>` | `<Google_Client_ID>` |

6. In the Traefik Domains section, assign your domain:
   - Production: `https://rexone.me`
   - UAT: `https://uat.rexone.me`

---

## 3. Alternative: Coolify Static Site Deployment

Coolify also supports deploying `rexone-web` directly as a **Static Application**:
- Build Pack: `Nixpacks` or `Static`
- Build Command: `npm run build`
- Publish Directory: `dist`
- SPA Mode: Enable SPA checkbox in Coolify settings.
