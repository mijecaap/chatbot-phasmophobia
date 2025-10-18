// Configuración del Chatbot de Phasmophobia
class ChatbotConfig {
    constructor() {
        this.config = this.loadConfig();
    }

    loadConfig() {
        // En un entorno de navegador, las variables de entorno se pasan a través de un objeto global
        // o se configuran directamente aquí como fallback
        const config = {
            webhookUrl: this.getEnvVar('WEBHOOK_URL', 'https://phasbotphobia-n8n.ep2m0t.easypanel.host/webhook/chatbot'),
            chatTimeout: parseInt(this.getEnvVar('CHAT_TIMEOUT', '30000')),
            maxMessageLength: parseInt(this.getEnvVar('MAX_MESSAGE_LENGTH', '500')),
            
            // Configuración de la UI
            loadingMessages: [
                '🔮 Consultando con los espíritus...',
                '👻 Analizando actividad paranormal...',
                '📡 Conectando con el más allá...',
                '🔍 Investigando pistas fantasmales...'
            ]
        };

        // Validar configuración
        this.validateConfig(config);
        
        return config;
    }

    getEnvVar(name, defaultValue) {
        // Para desarrollo en navegador, podemos usar variables definidas globalmente
        if (typeof window !== 'undefined' && window.ENV && window.ENV[name]) {
            return window.ENV[name];
        }
        
        // En un entorno Node.js (si se usa para build), usar process.env
        if (typeof process !== 'undefined' && process.env && process.env[name]) {
            return process.env[name];
        }
        
        return defaultValue;
    }

    validateConfig(config) {
        if (!config.webhookUrl) {
            throw new Error('WEBHOOK_URL es requerida en la configuración');
        }

        try {
            new URL(config.webhookUrl);
        } catch (error) {
            throw new Error(`WEBHOOK_URL no es una URL válida: ${config.webhookUrl}`);
        }

        if (config.chatTimeout < 1000) {
            console.warn('CHAT_TIMEOUT muy bajo, usando valor mínimo de 1000ms');
            config.chatTimeout = 1000;
        }

        if (config.maxMessageLength < 10) {
            console.warn('MAX_MESSAGE_LENGTH muy bajo, usando valor mínimo de 10');
            config.maxMessageLength = 10;
        }
    }

    get(key) {
        return this.config[key];
    }

    getWebhookUrl() {
        return this.config.webhookUrl;
    }

    getChatTimeout() {
        return this.config.chatTimeout;
    }

    getMaxMessageLength() {
        return this.config.maxMessageLength;
    }

    getRandomLoadingMessage() {
        const messages = this.config.loadingMessages;
        return messages[Math.floor(Math.random() * messages.length)];
    }
}

// Crear instancia global de configuración
window.chatbotConfig = new ChatbotConfig();