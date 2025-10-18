# Easypanel Configuration Guide

## Variables de Entorno Requeridas

Configura estas variables de entorno en Easypanel:

### Variables Obligatorias:
- `WEBHOOK_URL`: URL de tu webhook (ej: https://tu-webhook.com/webhook/chatbot)

### Variables Opcionales:
- `CHAT_TIMEOUT`: Timeout en milisegundos (default: 30000)
- `MAX_MESSAGE_LENGTH`: Longitud máxima del mensaje (default: 500)
- `PORT`: Puerto del contenedor (default: 3000)
- `NODE_ENV`: Entorno de Node.js (default: production)

## Configuración en Easypanel

### 1. Crear Nueva Aplicación
- Tipo: `Docker`
- Método: `Build from Git Repository`

### 2. Configuración del Repositorio
- Repository URL: `https://github.com/tu-usuario/chatbot-phasmophobia`
- Branch: `main`
- Build Context: `/`
- Dockerfile Path: `Dockerfile`

### 3. Configuración del Contenedor
- Port: `3000`
- Health Check Path: `/health`

### 4. Variables de Entorno
```
WEBHOOK_URL=https://phasbotphobia-n8n.ep2m0t.easypanel.host/webhook-test/phasbotphobia-appweb
CHAT_TIMEOUT=30000
MAX_MESSAGE_LENGTH=500
NODE_ENV=production
```

### 5. Configuración de Red
- Exponer puerto: `3000`
- Protocolo: `HTTP`

## Endpoints Disponibles

- `/` - Aplicación principal del chatbot
- `/health` - Endpoint de salud para monitoring
- `/api/regenerate-env` - Regenerar archivo env.js (POST)

## Logs y Monitoreo

El contenedor incluye:
- ✅ Health checks automáticos
- ✅ Logs estructurados
- ✅ Manejo de señales de terminación
- ✅ Usuario no privilegiado
- ✅ Optimización para producción

## Comandos Útiles

### Build local:
```bash
docker build -t chatbot-phasmophobia .
```

### Run local:
```bash
docker run -p 3000:3000 -e WEBHOOK_URL=tu-webhook-url chatbot-phasmophobia
```

### Test con docker-compose:
```bash
docker-compose up --build
```