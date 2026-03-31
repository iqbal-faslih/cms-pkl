# ========================
# STAGE 1: BUILD
# ========================
FROM node:20-alpine AS build

ARG NODE_ENV=production
ARG APP_NAME=default-app
ARG PORT=3000
ENV NODE_ENV=$NODE_ENV
ENV APP_NAME=$APP_NAME
ENV PORT=$PORT

WORKDIR /app

# Copy & install dependencies (termasuk dev)
COPY package*.json ./
RUN npm ci --legacy-peer-deps --include=dev

# Copy semua source code
COPY . .

RUN echo "🔹 Building in NODE_ENV=$NODE_ENV for APP_NAME=$APP_NAME"
RUN if [ "$NODE_ENV" = "production" ]; then \
      npm run build; \
    else \
      npm run build || (echo "⚠️ Build finished with warnings (ignored)" && exit 0); \
    fi


# ========================
# STAGE 2: PRODUCTION IMAGE
# ========================
FROM nginx:alpine AS production

ARG APP_NAME=default-app
ARG PORT=3000
ENV APP_NAME=$APP_NAME
ENV PORT=$PORT

# Copy hasil build dari stage 1 ke folder html nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

