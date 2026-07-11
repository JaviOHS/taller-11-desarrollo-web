# EventMila - Gestión de Eventos

Proyecto full-stack para la gestión de eventos personales. Cada usuario puede crear, editar y eliminar sus propios eventos, y hacerlos públicos para que el resto de usuarios los vea.

## Alcance del proyecto

### Funcionalidades actuales (v1)

- **Registro de usuarios** con validaciones (nombre, email, username, contraseña)
- **Inicio de sesión** con email/contraseña (contraseñas hasheadas con bcryptjs)
- **Inicio de sesión con Google OAuth 2.0**
- **Protección de rutas** mediante JWT (jsonwebtoken)
- **Perfil de usuario** con visualización del JWT

### Próximas funcionalidades

- **Modelo `Event`**: título, descripción, fecha, ubicación, estado (público/privado), creador
- **CRUD de eventos**: crear, listar, editar y eliminar eventos propios
- **Eventos públicos**: ventana para visualizar todos los eventos públicos de todos los usuarios
- **Panel de control** con navegación entre "Mis Eventos" y "Eventos Públicos"

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
├── app.js               # Configuración Express, MongoDB, Passport
├── index.js             # Punto de entrada (puerto 3001)
├── middleware/
│   ├── auth.js          # Middleware verificarToken + SECRET_KEY
│   └── passport.js      # Estrategia Google OAuth
├── models/
│   ├── User.js          # Modelo de usuario
│   └── Event.js         # Modelo de evento
├── routes/
│   └── index.js         # POST /registro, POST /login, GET /perfil, Google OAuth
└── .env                 # Variables de entorno (no versionado)

frontend/
├── src/
│   ├── App.jsx          # Manejo de autenticación y navegación login/register
│   ├── components/
│   │   ├── Login.jsx    # Formulario de inicio de sesión + Google OAuth
│   │   ├── Register.jsx # Formulario de registro
│   │   └── Dashboard.jsx # Perfil protegido + visualización del JWT
│   └── main.jsx         # Punto de entrada React
├── index.html
├── vite.config.js       # Proxy /api → localhost:3001
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

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/registro` | No | Registro de usuario con validaciones. Devuelve JWT |
| POST | `/api/login` | No | Inicio de sesión. Devuelve JWT |
| GET | `/api/perfil` | Bearer Token | Datos del usuario autenticado |
| GET | `/api/auth/google` | No | Redirige al login de Google OAuth |
| GET | `/api/auth/google/callback` | No | Callback OAuth, genera JWT y redirige al frontend |

## Validaciones

### Registro (`POST /api/registro`)

- `nombre`: obligatorio, mínimo 2 caracteres
- `email`: obligatorio, formato válido, único en la BD
- `username`: obligatorio, mínimo 3 caracteres, único en la BD
- `password`: obligatorio, mínimo 6 caracteres (se almacena hasheada con bcryptjs)

### Login (`POST /api/login`)

- `email` y `password`: obligatorios
- Si las credenciales son inválidas responde con `401` y mensaje genérico

## Pruebas con Postman

### Registro

```
POST http://localhost:3001/api/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@correo.com",
  "username": "juanperez",
  "password": "123456"
}
```

### Login

```
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "email": "juan@correo.com",
  "password": "123456"
}
```

Respuesta:
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": { "id": "...", "email": "juan@correo.com", "nombre": "Juan Pérez" }
}
```

### Ruta protegida

```
GET http://localhost:3001/api/perfil
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Login con Google

Abrir en el navegador `http://localhost:3000` y hacer clic en "Ingresar con Google".

## Flujo de autenticación

1. **Registro/Login local**: El usuario completa el formulario → `POST /api/registro` o `POST /api/login` → si los datos son válidos → se firma un JWT con `jwt.sign()` (expira en 2h) → se devuelve al frontend → se almacena en localStorage → se envía en header `Authorization: Bearer <token>` en cada request protegido.
2. **Google OAuth**: El usuario hace clic en "Ingresar con Google" → redirige a Google → Google autentica y redirige a `/api/auth/google/callback` → Passport obtiene el perfil → busca o crea usuario en MongoDB → genera JWT → redirige al frontend con `?token=<jwt>` → `App.jsx` lo captura y lo guarda en localStorage.
3. **Middleware de protección** (`verificarToken` en `middleware/auth.js`): extrae el token del header, lo verifica con `jwt.verify()` y adjunta el payload decodificado a `req.usuario`.
