# Script para probar el build de Docker localmente en Windows
# Úsalo para verificar que todo funciona antes de desplegar

Write-Host "🐳 Iniciando build de Docker para Chatbot Phasmophobia..." -ForegroundColor Cyan

# Build de la imagen
Write-Host "📦 Construyendo imagen Docker..." -ForegroundColor Yellow
docker build -t chatbot-phasmophobia:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completado exitosamente" -ForegroundColor Green
    
    Write-Host "🚀 Iniciando contenedor de prueba..." -ForegroundColor Yellow
    $webhookUrl = $env:WEBHOOK_URL
    if (-not $webhookUrl) {
        $webhookUrl = "No configurada"
    }
    Write-Host "📡 Webhook URL: $webhookUrl" -ForegroundColor Cyan
    
    # Run del contenedor
    $chatTimeout = if ($env:CHAT_TIMEOUT) { $env:CHAT_TIMEOUT } else { "30000" }
    $maxMessageLength = if ($env:MAX_MESSAGE_LENGTH) { $env:MAX_MESSAGE_LENGTH } else { "500" }
    
    $envVars = @(
        "-e", "WEBHOOK_URL=$($env:WEBHOOK_URL)",
        "-e", "CHAT_TIMEOUT=$chatTimeout",
        "-e", "MAX_MESSAGE_LENGTH=$maxMessageLength"
    )
    
    docker run -d --name chatbot-test -p 3000:3000 @envVars chatbot-phasmophobia:latest
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Contenedor iniciado exitosamente" -ForegroundColor Green
        Write-Host "🌐 Accede en: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "🔍 Health check: http://localhost:3000/health" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Para ver logs: docker logs chatbot-test" -ForegroundColor Gray
        Write-Host "Para parar: docker stop chatbot-test" -ForegroundColor Gray
        Write-Host "Para limpiar: docker rm chatbot-test" -ForegroundColor Gray
        
        # Esperar un poco y hacer health check
        Write-Host "⏳ Esperando que el servidor inicie..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        Write-Host "🔍 Probando health check..." -ForegroundColor Yellow
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Health check exitoso" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Health check retornó código: $($response.StatusCode)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "⚠️  Health check falló, pero el contenedor puede estar iniciando" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "❌ Error al iniciar el contenedor" -ForegroundColor Red
        exit 1
    }
    
} else {
    Write-Host "❌ Error en el build de Docker" -ForegroundColor Red
    exit 1
}