# Etapa de construcción
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm i --only=production && npm cache clean --force

# Etapa de producción
FROM node:18-alpine AS production

# Instalar dumb-init para manejo de señales
RUN apk add --no-cache dumb-init

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S chatbot -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar dependencias desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules

# Copiar archivos de la aplicación
COPY --chown=chatbot:nodejs . .

# Asegurar que el archivo env.js existe (será sobrescrito por el servidor)
RUN touch env.js && chown chatbot:nodejs env.js

# Cambiar a usuario no root
USER chatbot

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: process.env.PORT || 3000, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); \
    req.on('error', () => process.exit(1)); \
    req.on('timeout', () => process.exit(1)); \
    req.end();"

# Comando para iniciar la aplicación
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]