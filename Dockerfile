# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

FROM base AS dev
ENV NODE_ENV=development \
    HOST=0.0.0.0 \
    PORT=3000 \
    CHOKIDAR_USEPOLLING=true
EXPOSE 3000
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "3000"]

FROM base AS build
ENV NODE_ENV=production
RUN npm run build

FROM nginx:1.27-alpine AS prod
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
