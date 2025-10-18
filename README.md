# Chatbot Phasmophobia 🎭

Un chatbot interactivo para ayudar a los jugadores de Phasmophobia con información sobre fantasmas, equipos y estrategias.

## 🚀 Características

- **Interfaz web intuitiva**: Chat en tiempo real con diseño responsive
- **Configuración por variables de entorno**: URL del webhook y configuraciones personalizables
- **Manejo de errores**: Timeouts configurables y mensajes de error informativos
- **Mensajes de carga dinámicos**: Textos aleatorios mientras se procesa la consulta
- **Validación de entrada**: Límites de caracteres configurables

## 📋 Configuración

### 1. Variables de Entorno

Copia el archivo `.env.example` como `.env` y configura tus valores:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tu configuración:

```env
# URL del webhook (REQUERIDA)
WEBHOOK_URL=https://tu-webhook-url.com/webhook/chatbot

# Timeout para las peticiones HTTP en milisegundos (opcional)
CHAT_TIMEOUT=30000

# Longitud máxima de mensaje permitida (opcional)
MAX_MESSAGE_LENGTH=500
```

### 2. Variables de Entorno para el Navegador

Las variables de entorno se cargan a través del archivo `env.js`. En desarrollo, puedes editar este archivo directamente. En producción, deberías generar este archivo automáticamente desde tus variables de entorno del servidor.

```javascript
// env.js
window.ENV = {
    WEBHOOK_URL: 'tu-url-aqui',
    CHAT_TIMEOUT: '30000',
    MAX_MESSAGE_LENGTH: '500'
};
```

## 🖥️ Uso Local

### Opción 1: Servidor Node.js (Recomendado)

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno** (ver sección anterior)

3. **Iniciar servidor**:
   ```bash
   npm start
   ```

4. **Acceder**: http://localhost:3000

### Opción 2: Servidor HTTP Simple

1. **Configurar variables de entorno** (ver sección anterior)

2. **Abrir en navegador**: Simplemente abre `index.html` en tu navegador

3. **Usar con servidor local**:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server .
   
   # Con PHP
   php -S localhost:8000
   ```

## 🐳 Despliegue con Docker

### Build y Run Local

```bash
# Build de la imagen
docker build -t chatbot-phasmophobia .

# Run del contenedor
docker run -p 3000:3000 -e WEBHOOK_URL=tu-webhook-url chatbot-phasmophobia
```

### Docker Compose

```bash
# Configurar variables en .env
cp .env.example .env

# Iniciar con docker-compose
docker-compose up --build
```

### Despliegue en Easypanel

Consulta el archivo `EASYPANEL.md` para instrucciones detalladas de configuración en Easypanel.

## 📁 Estructura del Proyecto

```
chatbot-phasmophobia/
├── index.html          # Página principal del chatbot
├── script.js           # Lógica principal del chatbot
├── styles.css          # Estilos CSS
├── config.js           # Manejo de configuración
├── env.js              # Variables de entorno para el navegador
├── .env                # Variables de entorno (no incluido en git)
├── .env.example        # Plantilla de variables de entorno
├── .gitignore          # Archivos ignorados por git
└── README.md           # Este archivo
```

## ⚙️ Configuración Avanzada

### Personalizar Mensajes de Carga

Puedes personalizar los mensajes que aparecen mientras se procesa una consulta editando el array `loadingMessages` en `config.js`:

```javascript
loadingMessages: [
    '🔮 Consultando con los espíritus...',
    '👻 Analizando actividad paranormal...',
    '📡 Conectando con el más allá...',
    '🔍 Investigando pistas fantasmales...'
]
```

### Configurar Timeout

El timeout por defecto es de 30 segundos. Puedes cambiarlo en el archivo `.env`:

```env
CHAT_TIMEOUT=45000  # 45 segundos
```

### Límite de Caracteres

Por defecto, los mensajes están limitados a 500 caracteres. Puedes modificar este valor:

```env
MAX_MESSAGE_LENGTH=1000
```

## 🔧 Desarrollo

### Para Desarrolladores

Si quieres contribuir o modificar el chatbot:

1. **Fork del repositorio**
2. **Configurar variables de entorno locales**
3. **Realizar cambios**
4. **Probar localmente**
5. **Crear pull request**

### Estructura de Configuración

La configuración se maneja en tres niveles:

1. **Variables de entorno del sistema** (`.env`)
2. **Variables para el navegador** (`env.js`)
3. **Configuración de la aplicación** (`config.js`)

## 📝 API del Webhook

El chatbot envía requests POST al webhook configurado con el siguiente formato:

```json
{
    "message": "¿Qué equipos necesito para identificar un Demon?",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "source": "web-chatbot"
}
```

Espera una respuesta en formato:

```json
{
    "reply": "Para identificar un Demon necesitas..."
}
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Crea un issue para discutir cambios grandes
2. Fork el proyecto
3. Crea una rama para tu feature
4. Commit tus cambios
5. Push a la rama
6. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto. Consulta el archivo LICENSE para más detalles.

## 🎮 Sobre Phasmophobia

Phasmophobia es un juego de terror cooperativo para 4 jugadores donde eres un investigador paranormal. Este chatbot te ayuda a entender mejor los diferentes tipos de fantasmas, equipos disponibles y estrategias de investigación.
