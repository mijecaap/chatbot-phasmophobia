#!/bin/bash

# Script para probar el build de Docker localmente
# Úsalo para verificar que todo funciona antes de desplegar

echo "🐳 Iniciando build de Docker para Chatbot Phasmophobia..."

# Build de la imagen
echo "📦 Construyendo imagen Docker..."
docker build -t chatbot-phasmophobia:latest .

if [ $? -eq 0 ]; then
    echo "✅ Build completado exitosamente"
    
    echo "🚀 Iniciando contenedor de prueba..."
    echo "📡 Webhook URL: ${WEBHOOK_URL:-'No configurada'}"
    
    # Run del contenedor
    docker run -d \
        --name chatbot-test \
        -p 3000:3000 \
        -e WEBHOOK_URL="${WEBHOOK_URL}" \
        -e CHAT_TIMEOUT="${CHAT_TIMEOUT:-30000}" \
        -e MAX_MESSAGE_LENGTH="${MAX_MESSAGE_LENGTH:-500}" \
        chatbot-phasmophobia:latest
    
    if [ $? -eq 0 ]; then
        echo "✅ Contenedor iniciado exitosamente"
        echo "🌐 Accede en: http://localhost:3000"
        echo "🔍 Health check: http://localhost:3000/health"
        echo ""
        echo "Para ver logs: docker logs chatbot-test"
        echo "Para parar: docker stop chatbot-test"
        echo "Para limpiar: docker rm chatbot-test"
        
        # Esperar un poco y hacer health check
        echo "⏳ Esperando que el servidor inicie..."
        sleep 5
        
        echo "🔍 Probando health check..."
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            echo "✅ Health check exitoso"
        else
            echo "⚠️  Health check falló, pero el contenedor puede estar iniciando"
        fi
        
    else
        echo "❌ Error al iniciar el contenedor"
        exit 1
    fi
    
else
    echo "❌ Error en el build de Docker"
    exit 1
fi