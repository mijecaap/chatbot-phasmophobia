#!/usr/bin/env node

/**
 * Script para generar env.js desde .env
 * Uso: node build-env.js
 */

const fs = require('fs');
const path = require('path');

function loadEnvFile() {
    const envPath = path.join(__dirname, '.env');
    
    if (!fs.existsSync(envPath)) {
        console.error('❌ Archivo .env no encontrado');
        console.log('💡 Copia .env.example como .env y configura tus valores');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
        line = line.trim();
        
        // Ignorar comentarios y líneas vacías
        if (line.startsWith('#') || !line) {
            return;
        }

        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            envVars[key.trim()] = value;
        }
    });

    return envVars;
}

function generateEnvJs(envVars) {
    const jsContent = `// Variables de entorno para el navegador
// Este archivo es generado automáticamente desde .env
// NO edites este archivo directamente - edita .env en su lugar

window.ENV = ${JSON.stringify(envVars, null, 4)};

// Generado el: ${new Date().toISOString()}
`;

    const envJsPath = path.join(__dirname, 'env.js');
    fs.writeFileSync(envJsPath, jsContent, 'utf8');
    
    console.log('✅ Archivo env.js generado exitosamente');
    console.log(`📁 Ubicación: ${envJsPath}`);
    console.log('📋 Variables cargadas:', Object.keys(envVars).join(', '));
}

function main() {
    try {
        console.log('🔄 Generando env.js desde .env...');
        
        const envVars = loadEnvFile();
        
        // Validar que al menos WEBHOOK_URL esté presente
        if (!envVars.WEBHOOK_URL) {
            console.error('❌ WEBHOOK_URL es requerida en el archivo .env');
            process.exit(1);
        }

        generateEnvJs(envVars);
        
        console.log('🎉 ¡Proceso completado!');
        
    } catch (error) {
        console.error('❌ Error al generar env.js:', error.message);
        process.exit(1);
    }
}

// Ejecutar solo si este archivo es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { loadEnvFile, generateEnvJs };