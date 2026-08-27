# === Étape 1 : build Angular ===
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# === Étape 2 : runtime nginx ===
FROM nginx:alpine
COPY --from=build /app/dist/dms/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80