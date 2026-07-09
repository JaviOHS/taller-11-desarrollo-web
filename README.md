# Iguanas App - API de Registro de Iguanas

Proyecto full-stack con autenticación JWT y login con Google OAuth.

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
│   └── User.js          # Modelo de usuario (Mongoose)
├── routes/
│   └── index.js         # POST /login, GET /perfil, GET /auth/google, GET /auth/google/callback
└── .env                 # Variables de entorno (no versionado)

frontend/
├── src/
│   ├── App.jsx          # Manejo de estado de autenticación y token desde URL
│   ├── components/
│   │   ├── Login.jsx    # Formulario de login + botón Google OAuth
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
MONGO_URI=mongodb://localhost:27017/iguanas-app
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
| POST | `/api/login` | No | Login o registro con email/contraseña. Devuelve JWT |
| GET | `/api/perfil` | Bearer Token | Datos del usuario autenticado |
| GET | `/api/auth/google` | No | Redirige al login de Google OAuth |
| GET | `/api/auth/google/callback` | No | Callback OAuth, genera JWT y redirige al frontend |

## Pruebas con Postman

### Login con email/contraseña

```
POST http://localhost:3001/api/login
Content-Type: application/json

{
  "email": "test@correo.com",
  "password": "123456"
}
```

Respuesta:
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": { "id": "...", "email": "test@correo.com", "nombre": "test" }
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

1. **JWT local**: El usuario ingresa email/contraseña → `POST /api/login` → si credenciales válidas → se firma un JWT con `jwt.sign()` (expira en 2h) → se devuelve al frontend → se almacena en localStorage → se envía en header `Authorization: Bearer <token>` en cada request protegido.
2. **Google OAuth**: El usuario hace clic en "Ingresar con Google" → redirige a Google → Google autentica y redirige a `/api/auth/google/callback` → Passport obtiene el perfil → busca o crea usuario en MongoDB → genera JWT → redirige al frontend con `?token=<jwt>` → `App.jsx` lo captura y lo guarda en localStorage.
3. **Middleware de protección** (`verificarToken` en `middleware/auth.js`): extrae el token del header, lo verifica con `jwt.verify()` y adjunta el payload decodificado a `req.usuario`.
