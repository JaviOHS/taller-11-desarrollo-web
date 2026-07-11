# EventMila - Gestión de Eventos

Proyecto full-stack para la gestión de eventos personales. Cada usuario puede crear, editar y eliminar sus propios eventos, y hacerlos públicos para que el resto de usuarios los descubra.

## Funcionalidades

- **Autenticación**: Registro de usuarios, inicio de sesión con email/contraseña, e inicio de sesión con Google OAuth 2.0
- **Protección de rutas** mediante JWT con expiración de 2 horas
- **CRUD de eventos**: Crear, listar, editar y eliminar eventos propios
- **Eventos públicos/privados**: Control de visibilidad por evento
- **Panel de navegación** con vistas: Mi Perfil, Mis Eventos, Eventos Públicos
- **Búsqueda y filtrado** de eventos por texto y estado (público/privado)
- **Vista en cuadrícula o lista**
- **Subida de imágenes** para perfil y eventos (compresión client-side)
- **Modo oscuro** con persistencia en localStorage
- **Notificaciones toast** con auto-descarte: inicio/cierre de sesión, creación/edición/eliminación de eventos
- **Campos normalizados**: título, ubicación y categoría se almacenan en **UPPERCASE** (descripción se conserva tal cual)

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js, Express |
| Base de datos | MongoDB + Mongoose |
| Autenticación | jsonwebtoken, bcryptjs, Passport.js |
| OAuth | passport-google-oauth20 |
| Frontend | React 18, Vite, Tailwind CSS |

## Estructura del proyecto

```
backend/
├── app.js                    # Configuración Express, MongoDB, Passport
├── index.js                  # Punto de entrada (puerto 3001)
├── middleware/
│   ├── auth.js               # verificarToken, optionalAuth
│   ├── owner.js              # requireResourceOwner
│   └── passport.js           # Estrategia Google OAuth
├── models/
│   ├── User.js               # Modelo de usuario
│   └── Event.js              # Modelo de evento
├── routes/
│   ├── index.js              # /api/registro, /api/login, /api/perfil, Google OAuth
│   └── events.js             # CRUD /api/eventos
├── utils/
│   └── validation.js         # Validaciones de campos
└── .env                      # Variables de entorno (no versionado)

frontend/
├── src/
│   ├── App.jsx               # Autenticación, navegación, notificaciones
│   ├── main.jsx              # Punto de entrada React
│   ├── components/
│   │   ├── AuthCard.jsx      # Login, registro y Google OAuth
│   │   ├── Avatar.jsx        # Avatar de usuario
│   │   ├── Dashboard.jsx     # Perfil, estadísticas y JWT
│   │   ├── EventCard.jsx     # Tarjeta de evento (grid/lista)
│   │   ├── MyEvents.jsx      # CRUD de eventos del usuario
│   │   ├── Notification.jsx  # Notificaciones toast auto-descartables
│   │   ├── PublicEvents.jsx  # Explorar eventos públicos
│   │   └── SearchToolbar.jsx # Búsqueda y cambio de vista
│   ├── hooks/
│   │   ├── useDarkMode.js    # Modo oscuro
│   │   └── useParticles.js   # Fondo de partículas
│   └── utils/
│       ├── categorias.js     # Lista de categorías
│       ├── image.js          # Compresión de imágenes
│       └── jwt.js            # Decodificación de JWT
├── index.html
├── vite.config.js            # Proxy /api → localhost:3001
└── tailwind.config.js
```

## Instalación

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## Configuración (.env)

Crear `backend/.env`:

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/eventmila
SECRET_KEY=tu_clave_secreta
GOOGLE_CLIENT_ID=tu_id_de_google_cloud
GOOGLE_CLIENT_SECRET=tu_secret_de_google_cloud
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

### Google Cloud Console

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear proyecto → "APIs y Servicios" → "Pantalla de consentimiento OAuth" (tipo Externo)
3. Agregar tu correo como usuario de prueba
4. "Credenciales" → "Crear credenciales" → "ID de cliente OAuth"
5. Tipo: Aplicación web
   - Orígenes autorizados: `http://localhost:3000`
   - URI de redirección: `http://localhost:3001/api/auth/google/callback`

## Ejecución

```bash
# Backend (con nodemon)
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

Backend en `http://localhost:3001`, Frontend en `http://localhost:3000`.

## Endpoints de la API

### Autenticación
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/registro` | No | Registro de usuario. Devuelve JWT |
| POST | `/api/login` | No | Inicio de sesión. Devuelve JWT |
| GET | `/api/perfil` | Bearer Token | Datos del usuario autenticado |
| GET | `/api/auth/google` | No | Redirige al login de Google OAuth |
| GET | `/api/auth/google/callback` | No | Callback OAuth, genera JWT y redirige al frontend |

### Eventos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/eventos/` | Bearer Token | Crear evento |
| GET | `/api/eventos/mis-eventos` | Bearer Token | Listar eventos del usuario |
| GET | `/api/eventos/publicos` | No | Listar eventos públicos de todos los usuarios |
| GET | `/api/eventos/:id` | Opcional | Obtener un evento por ID |
| PUT | `/api/eventos/:id` | Bearer Token + Propietario | Actualizar evento |
| DELETE | `/api/eventos/:id` | Bearer Token + Propietario | Eliminar evento |

## Validaciones

### Registro (`POST /api/registro`)
- `nombre`: obligatorio, mínimo 2 caracteres
- `email`: obligatorio, formato válido, único en la BD
- `username`: obligatorio, mínimo 3 caracteres, único en la BD
- `password`: obligatorio, mínimo 6 caracteres (se almacena hasheada con bcryptjs)

### Eventos
- `title`: obligatorio, mínimo 3 caracteres (se guarda en UPPERCASE)
- `date`: obligatorio, fecha válida
- `category`: debe ser una categoría válida (se guarda en UPPERCASE)
- `status`: debe ser `public` o `private`
- `image`: opcional, formato PNG/JPG/WEBP/GIF, máximo 4MB
- `location`: opcional (se guarda en UPPERCASE)
- `description`: opcional (se guarda tal cual)

## Notificaciones

El sistema muestra notificaciones toast automáticas en estas acciones:

| Acción | Mensaje | Duración |
|--------|---------|----------|
| Inicio de sesión | "Inicio de sesión exitoso" | 3s |
| Registro | "Cuenta creada exitosamente" | 3s |
| Google OAuth | "Inicio de sesión exitoso" | 3s |
| Cerrar sesión | "Sesión cerrada" | 3s |
| Crear evento | "Evento creado exitosamente" | 3s |
| Editar evento | "Evento editado exitosamente" | 3s |
| Eliminar evento | "Evento eliminado exitosamente" | 3s |

## Flujo de autenticación

1. **Registro/Login local**: El usuario completa el formulario → `POST /api/registro` o `POST /api/login` → si los datos son válidos → se firma un JWT con `jwt.sign()` (expira en 2h) → se devuelve al frontend → se almacena en localStorage → se envía en header `Authorization: Bearer <token>` en cada request protegido.
2. **Google OAuth**: El usuario hace clic en "Continuar con Google" → redirige a Google → Google autentica y redirige a `/api/auth/google/callback` → Passport obtiene el perfil → busca o crea usuario en MongoDB → genera JWT → redirige al frontend con `?token=<jwt>` → `App.jsx` lo captura y lo guarda en localStorage.
3. **Middleware de protección** (`verificarToken` en `middleware/auth.js`): extrae el token del header, lo verifica con `jwt.verify()` y adjunta el payload decodificado a `req.usuario`.
