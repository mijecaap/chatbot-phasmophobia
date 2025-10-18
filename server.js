const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('.'));
app.use(express.json());

// Función para generar env.js desde variables de entorno
function generateEnvJs() {
    const envVars = {
        WEBHOOK_URL: process.env.WEBHOOK_URL,
        CHAT_TIMEOUT: process.env.CHAT_TIMEOUT || '30000',
        MAX_MESSAGE_LENGTH: process.env.MAX_MESSAGE_LENGTH || '500'
    };

    // Filtrar variables undefined
    Object.keys(envVars).forEach(key => {
        if (envVars[key] === undefined) {
            delete envVars[key];
        }
    });

    const jsContent = `// Variables de entorno para el navegador
// Este archivo es generado automáticamente desde variables de entorno
// NO edites este archivo directamente

window.ENV = ${JSON.stringify(envVars, null, 4)};

// Generado el: ${new Date().toISOString()}
`;

    fs.writeFileSync('./env.js', jsContent, 'utf8');
    console.log('✅ Archivo env.js generado exitosamente');
    console.log('📋 Variables cargadas:', Object.keys(envVars).join(', '));
}

// Generar env.js al iniciar el servidor
generateEnvJs();

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de salud para Easypanel
app.get('/health', (req, res) => {
    const healthData = { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        env: {
            nodeVersion: process.version,
            port: port,
            webhookConfigured: !!process.env.WEBHOOK_URL,
            nodeEnv: process.env.NODE_ENV || 'development'
        },
        memory: process.memoryUsage(),
        pid: process.pid
    };
    
    console.log('🔍 Health check solicitado:', healthData);
    res.json(healthData);
});

// Ruta de debug (solo para desarrollo/diagnóstico)
app.get('/debug', (req, res) => {
    res.json({
        timestamp: new Date().toISOString(),
        environment: process.env,
        headers: req.headers,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
});

// Ruta para regenerar env.js (útil para desarrollo)
app.post('/api/regenerate-env', (req, res) => {
    try {
        generateEnvJs();
        res.json({ success: true, message: 'env.js regenerado exitosamente' });
    } catch (error) {
        console.error('Error regenerando env.js:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor iniciado en puerto ${port}`);
    console.log(`🌐 Accede en: http://localhost:${port}`);
    console.log(`🔗 Webhook URL: ${process.env.WEBHOOK_URL || 'No configurada'}`);
    console.log(`📊 Proceso PID: ${process.pid}`);
    console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV}`);
    
    // Validar configuración crítica
    if (!process.env.WEBHOOK_URL) {
        console.warn('⚠️  WEBHOOK_URL no está configurada');
    }
    
    console.log('✅ Servidor listo para recibir conexiones');
});

// Manejar errores del servidor
server.on('error', (error) => {
    console.error('❌ Error del servidor:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Puerto ${port} ya está en uso`);
    }
    process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('📴 Recibida señal SIGTERM, cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📴 Recibida señal SIGINT, cerrando servidor...');
    process.exit(0);
});