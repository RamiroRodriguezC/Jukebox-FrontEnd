# ETAPA 1: Construcción (Build)
# Usamos Node solo para compilar el código de React
FROM node:18-alpine AS build-step
WORKDIR /app

# le agregamos como argumento para el comando de run la url del backend
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
#

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ETAPA 2: Producción (Servir)
# Usamos Nginx, que es mucho más liviano y rápido para archivos estáticos
FROM nginx:stable-alpine
# Copiamos los archivos resultantes de la etapa anterior a la carpeta de Nginx
COPY --from=build-step /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 (estándar para tráfico web)
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]