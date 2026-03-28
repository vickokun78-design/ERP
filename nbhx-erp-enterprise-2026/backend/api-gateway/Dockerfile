# ==========================================
# NBHX ERP API Gateway - Dockerfile
# ==========================================

FROM node:20-alpine AS development

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache curl

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 4000

# Comando por defecto
CMD ["npm", "run", "start:dev"]

# ==========================================
# Etapa de Producción
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache curl

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar aplicación
RUN npm run build

# Exponer puerto
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Comando por defecto
CMD ["node", "dist/main"]
