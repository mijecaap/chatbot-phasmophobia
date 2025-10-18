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
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        env: {
            nodeVersion: process.version,
            port: port,
            webhookConfigured: !!process.env.WEBHOOK_URL
        }
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
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor iniciado en puerto ${port}`);
    console.log(`🌐 Accede en: http://localhost:${port}`);
    console.log(`🔗 Webhook URL: ${process.env.WEBHOOK_URL || 'No configurada'}`);
    
    // Validar configuración crítica
    if (!process.env.WEBHOOK_URL) {
        console.warn('⚠️  WEBHOOK_URL no está configurada');
    }
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