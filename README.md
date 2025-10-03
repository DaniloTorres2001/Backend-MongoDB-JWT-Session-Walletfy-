# Walletfy API – MongoDB-JWT-Session-Walletfy

API REST simple para Walletfy que gestiona la entidad evento (ingresos/egresos). Incluye CRUD, validación con express-validator, logging propio y endpoints de salud. Diseñada para integrarse con el frontend Walletfy de React. Se añladio la funcionalidad de MongoDb.

## 📋 Descripción

Un evento representa un movimiento financiero:
```json
{
  "id": 1,
  "nombre": "Sueldo diciembre",
  "descripcion": "Pago mensual",
  "cantidad": 1500,
  "fecha": "2024-12-05",
  "tipo": "ingreso",
  "adjunto": ""
}
```
- **tipo**: "ingreso" o "egreso"
- **fecha**: ISO YYYY-MM-DD


## 🚀 Características

- CRUD completo de eventos
- Validación de datos con express-validator
- Filtro por tipo y mes (?tipo=ingreso|egreso&mes=YYYY-MM)
- Logger propio (método, URL, hora, querystring)
- Endpoint de salud /health
- Respuestas JSON consistentes con code, message, data
- Hot reload con nodemon
- Autenticación:
   - Login con Basic Auth → JWT.
   - JWT protegido en rutas CRUD.
   - Sesión con cookie: login/logout con sesión persistente.

## 🛠️ Tecnologías

### Backend
- **Node.js** – Runtime de JavaScript para el servidor
- **MongoDB Atlas** – Base de datos NoSQL en la nube
- **Express.js** – Framework web para Node.js
- **Mongoose** – ODM para MongoDB
- **Express-Validator** – Validación de datos de entrada
- **Express-session** – Manejo de sesiones con cookies.
- **jsonwebtoken (JWT)** – Generación y verificación de JWT.

### Herramientas de Desarrollo
- **nodemon** – Auto-restart del servidor en desarrollo
- **Git & GitHub** – Control de versiones

## 📦 Instalación

1. Clona el repositorio:
```bash
git https://github.com/DaniloTorres2001/Backend-MongoDB-JWT-Session-Walletfy-.git
cd Backend-MongoDB-JWT-Session-Walletfy
```

2. Instala las dependencias:
```bash
npm install
```

3. (Opcional) nodemon para autoreload en dev:
```bash
npm i -D nodemon
```
4. Scripts en package.json:
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```
4. Ejecuta:
```bash
# desarrollo
npm run dev

# producción / simple
npm start
```

El servidor estará ejecutándose en `http://localhost:3030`

## 📁 Estructura del Proyecto

```
Backend-MongoDB--Walletfy/
├── controllers/
│   └── v1/
│       └── events.js        # Controladores de eventos
│       └── auth.js          # Rutas de login/logout (sesión con cookie y JWT)
├── middlewares/
│   ├── apiKey.js            # Middleware para autenticación con API key
│   ├── basicAuth.js         # Middleware para Basic Auth
│   ├── jwtAuth.js           # Middleware para autenticación con JWT
│   └── performance.js       # Middleware de rendimiento
├── models/
│   └── events.js            # Modelo de datos de eventos
│   └── users.js             # Modelo de datos de usuarios
├── schemas/
│   └── events.js            # Esquemas de validación de eventos
│   └── users.js             # Esquemas de validación de usuarios
├── db.js                    # Configuración de base de datos
├── index.js                 # Servidor principal con rutas
├── callback.js              # Ejemplos de callbacks y promesas
├── .env                     # Variables de entorno (PORT, MONGODB_URI)
├── package.json             # Dependencias del proyecto
└── README.md                # Este archivo
```

### Variables de Entorno

Crea un archivo .env en la raíz con el siguiente contenido:
```env
PORT=3001
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster-url>/<db>?retryWrites=true&w=majority

```

## 🔗 Endpoints

### Salud del servicio
```http
GET /health
```
**Respuesta exitosa:**
```json
{ "status": "ok", "uptime": 12.34, "timestamp": "2025-01-01T00:00:00.000Z" }
```

### Autenticación (JWT y Sesión con Cookie)

### Login (con Basic Auth y sesión con cookie)
```http
POST /api/v1/auth/login
```
**Body (JSON):**
```json
{
  "email": "danilo@gmail.com",
  "password": "1234"
}
```

**Respuesta esperada:**
```json
{
  "code": "OK",
  "message": "Login successful!",
  "data": {
    "user": {
      "id": 1758847116901,
      "email": "danilo@gmail.com",
      "role": "user"
    }
  }
}
```
### Obtener sesión activa
```http
GET /api/v1/auth/session
```
**Headers:**
```pgsql
Cookie: connect.sid=your-session-id
```

**Respuesta esperada:**
```json
{
  "code": "OK",
  "message": "Active session!",
  "data": {
    "user": {
      "id": 1758847116901,
      "email": "danilo@gmail.com",
      "role": "user"
    }
  }
}
```

### Logout
```http
POST /api/v1/auth/logout
```
**Headers:**
```pgsql
Cookie: connect.sid=your-session-id
```

**Respuesta esperada:**
```json
{
  "code": "OK",
  "message": "Logout successful!"
}
```


## 📝 Códigos de respuesta

- `200 OK` – Lecturas/actualizaciones/eliminaciones exitosas
- `201 Created `– Creación exitosa
- `400 Bad Request` – Datos inválidos
- `404 Not Found` – Recurso no existe
- `500 Internal Server Error` – Error inesperado

## 📖 Características Implementadas

### Arquitectura en Capas

1. **Schemas** (`schemas/`): Definición de esquemas de Mongoose con validaciones
2. **Models** (`models/`): Abstracción de acceso a datos con callbacks
3. **Controllers** (`controllers/`): Lógica de negocio y endpoints
4. **Middlewares** (`middlewares/`): Funcionalidades transversales

### API Endpoints

#### Eventos CRUD de Eventos (protegido con JWT o cookie)

**Headers:**
```makefile
Authorization: Bearer your-jwt-token
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/events/all` | Obtener todos los eventos |
| GET | `/api/v1/events` | Obtener eventos con filtros (tipo, mes) y paginación |
| GET | `/api/v1/events/query?id=1` | Obtener evento por ID |
| POST | `/api/v1/events` | Crear nuevo evento |
| PUT | `/api/v1/events/:id` | Actualizar evento |
| DELETE | `/api/v1/events/:id` | Eliminar evento |
| GET | `/health` | Verificar estado del servidor y DB |

### Ejemplo de Uso

#### Crear Evento
```bash
curl -X POST http://localhost:3001/api/v1/events   -H "Content-Type: application/json"   -d '{
    "nombre": "Compra supermercado",
    "descripcion": "Mercado semanal",
    "cantidad": 80,
    "fecha": "2025-09-22",
    "tipo": "egreso",
    "adjunto": "ticket.jpg"
  }'
```

#### Obtener Todos los Eventos
```bash
curl http://localhost:3001/api/v1/events/all
```

#### Buscar Evento por ID
```bash
curl http://localhost:3001/api/v1/events/query?id=1
```

#### Obtener Eventos Filtrados (ejemplo: egresos en enero 2025)
```bash
curl "http://localhost:3001/api/v1/events?tipo=egreso&mes=2025-01&page=1&limit=5"
```

## 🔧 Características Técnicas

### Validaciones Implementadas
- Validación de query params y body con Express-Validator
- Esquemas de Mongoose con restricciones (required, enum, min)
- Manejo de errores centralizado en controllers

### Middlewares
- **Performance Middleware**: Log de requests, headers e IP
- **JSON Parser**: Procesamiento de datos JSON
- **Error Handling**: Manejo de errores con callbacks

### Base de Datos
- **Colección**: `events`
- **IDs personalizados**: Numéricos basados en `Date.now()`

## 📝 Patrones de Diseño Aplicados

1. **MVC (Model-View-Controller)**: Separación de responsabilidades
2. **Repository Pattern**: Abstracción de acceso a datos
3. **Middleware Pattern**: Funcionalidades transversales
4. **Error Handling Pattern**: Manejo consistente de errores


## 🧪 Pruebas

Puedes probar los endpoints usando herramientas como:
- **Postman**
- **Thunder Client** (extensión de VS Code)
- **curl**

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Danilo Torres** - [dantvera@espol.edu.ec](mailto:dantvera@espol.edu.ec)

---

*Parte del proyecto Walletfy – API básica de eventos para integrar con el frontend.*

