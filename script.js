class PhasmophobiaChatbot {
    constructor() {
        // Verificar que la configuración esté disponible
        if (!window.chatbotConfig) {
            throw new Error('Configuración del chatbot no encontrada. Asegúrate de que config.js se carga antes que script.js');
        }
        
        this.config = window.chatbotConfig;
        this.webhookUrl = this.config.getWebhookUrl();
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        // Configurar límite de caracteres del input
        this.messageInput.maxLength = this.config.getMaxMessageLength();
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Enviar mensaje al hacer clic en el botón
        this.sendButton.addEventListener('click', () => {
            this.handleSendMessage();
        });

        // Enviar mensaje al presionar Enter
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Enfocar el input al cargar la página
        this.messageInput.focus();
    }

    async handleSendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) {
            return;
        }

        // Deshabilitar la interfaz durante el envío
        this.setLoadingState(true);
        
        // Agregar mensaje del usuario al chat
        this.addMessage(message, 'user');
        
        // Limpiar input
        this.messageInput.value = '';

        try {
            // Enviar mensaje al webhook
            const response = await this.sendToWebhook(message);
            
            // Agregar respuesta del bot
            if (response && response.reply) {
                this.addMessage(response.reply, 'bot');
            } else {
                this.addMessage('Lo siento, no pude procesar tu mensaje. Por favor, inténtalo de nuevo.', 'bot');
            }
        } catch (error) {
            console.error('Error al comunicarse con el webhook:', error);
            this.addMessage('❌ Ocurrió un error al conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.', 'bot');
        } finally {
            // Rehabilitar la interfaz
            this.setLoadingState(false);
        }
    }

    async sendToWebhook(message) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.getChatTimeout());
            
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    timestamp: new Date().toISOString(),
                    source: 'web-chatbot'
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('La solicitud ha excedido el tiempo límite. Por favor, inténtalo de nuevo.');
            }
            console.error('Error en la petición al webhook:', error);
            throw error;
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const icon = document.createElement('span');
        icon.className = `${sender}-icon`;
        icon.textContent = sender === 'bot' ? '🤖' : '👤';

        const textElement = document.createElement('p');
        textElement.textContent = text;

        contentDiv.appendChild(icon);
        contentDiv.appendChild(textElement);
        messageDiv.appendChild(contentDiv);

        this.chatMessages.appendChild(messageDiv);
        
        // Hacer scroll al último mensaje
        this.scrollToBottom();
    }

    setLoadingState(isLoading) {
        this.sendButton.disabled = isLoading;
        this.messageInput.disabled = isLoading;
        this.loadingIndicator.style.display = isLoading ? 'block' : 'none';

        if (isLoading) {
            this.sendButton.style.opacity = '0.5';
            this.messageInput.style.opacity = '0.7';
            // Usar mensaje de carga aleatorio
            const loadingText = this.loadingIndicator.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = this.config.getRandomLoadingMessage();
            }
        } else {
            this.sendButton.style.opacity = '1';
            this.messageInput.style.opacity = '1';
            this.messageInput.focus();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    // Método para agregar mensajes predefinidos (opcional)
    addQuickActions() {
        const quickActions = [
            '¿Qué equipos necesito para identificar un Demon?',
            '¿Cómo funciona el Spirit Box?',
            '¿Cuáles son los signos de actividad paranormal?',
            '¿Qué debo hacer si el fantasma está cazando?'
        ];

        // Esta función podría expandirse para agregar botones de respuesta rápida
        console.log('Acciones rápidas disponibles:', quickActions);
    }
}

// Inicializar el chatbot cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new PhasmophobiaChatbot();
    
    // Mensaje de bienvenida adicional después de un momento
    setTimeout(() => {
        console.log('Chatbot de Phasmophobia inicializado correctamente');
    }, 1000);
});

// Manejar errores globales de JavaScript
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

// Manejar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada:', event.reason);
});