<p align="center">
  <h1 align="center">Ritmo Claro API</h1>
  <p align="center">API REST para gestión personal de hábitos con autenticación JWT, autorización por roles y persistencia en PostgreSQL.</p>
</p>

## Descripción

Ritmo Claro API es un backend construido con NestJS que permite a los usuarios registrar hábitos, consultarlos, actualizarlos y eliminarlos. Cada usuario solo puede ver y modificar sus propios hábitos; el personal `ADMIN` puede consultar el listado global.

La arquitectura separa responsabilidades por módulo: `auth` (identidad y JWT), `habitos` (recurso de negocio y CRUD) y `prisma` (acceso compartido a la base de datos).

## Stack tecnológico

| Componente | Tecnología |
| --- | --- |
| Framework | NestJS 11 (TypeScript) |
| Base de datos | PostgreSQL |
| ORM | Prisma 7 (driver adapter `@prisma/adapter-pg`) |
| Autenticación | JWT + Passport (`bcrypt` para hashes) |
| Validación | class-validator + class-transformer |
| Documentación | Swagger (`/docs`) |
| Seguridad | Helmet, CORS |
| Contenedores | Docker |

## Requisitos

- Node.js 22 o superior
- npm 10 o superior
- Una base de datos PostgreSQL (local o remota, por ejemplo Supabase)

## Configuración del entorno

Copia el archivo de ejemplo y define tus valores reales. Nunca subas `.env` al repositorio.

```bash
cp .env.example .env
```

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | URL de conexión PostgreSQL (`postgresql://usuario:password@host:5432/base`) |
| `JWT_SECRET` | Secreto largo y aleatorio para firmar los tokens |
| `PORT` | Puerto del servidor (por defecto `3000`) |

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Generar el cliente de Prisma
npx prisma generate

# 3. Aplicar migraciones
npx prisma migrate deploy

# 4. Arrancar en desarrollo (con watch)
npm run start:dev
```

La API queda disponible en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/docs`.

## Endpoints

Todas las rutas de `/habitos` requieren header `Authorization: Bearer <token>`.

### Autenticación

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/auth/register` | Crea un usuario con rol `USUARIO` por defecto |
| `POST` | `/auth/login` | Devuelve un `access_token` JWT (expira en 1 hora) |

### Hábitos (autenticados)

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/habitos` | Crea un hábito del usuario autenticado |
| `GET` | `/habitos` | Lista los hábitos del usuario autenticado |
| `GET` | `/habitos/:id` | Obtiene un hábito por id (solo el dueño) |
| `PATCH` | `/habitos/:id` | Actualiza nombre, descripción, estado o frecuencia (solo el dueño) |
| `DELETE` | `/habitos/:id` | Elimina un hábito por id (solo el dueño) |

### Hábitos (solo ADMIN)

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/habitos/admin/todas` | Listado global de hábitos con datos básicos del propietario |

### Contrato de errores

Todos los errores responden con la misma forma:

```json
{
  "statusCode": 400,
  "timestamp": "2026-10-09T12:00:00.000Z",
  "path": "/habitos",
  "message": "El nombre debe tener al menos 3 caracteres"
}
```

Códigos utilizados: `400` validación, `401` sin token o credenciales inválidas, `403` sin permiso o recurso ajeno, `404` recurso inexistente, `409` email ya registrado, `500` error interno genérico (el detalle solo se registra en el servidor).

## Estructura del proyecto

```
src/
├── main.ts                  # Arranque y configuración global (pipe, filtro, helmet, swagger)
├── app.module.ts            # Conecta los módulos de la aplicación
├── auth/                    # Registro, login, JWT, guards y roles
│   ├── dto/                 # RegisterDto, LoginDto
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── roles.decorator.ts
├── habitos/                 # CRUD del recurso de negocio
│   ├── dto/                 # CrearHabitoDto, ActualizarHabitoDto
│   ├── habitos.controller.ts
│   └── habitos.service.ts
├── prisma/                  # PrismaService compartido (global)
├── common/filters/          # Filtro global de excepciones HTTP
└── generated/prisma/        # Cliente generado por Prisma (no editar a mano)

prisma/
├── schema.prisma            # Modelos Usuario, Habito y enums
└── migrations/              # Migraciones versionadas
```

## Docker

```bash
# Construir la imagen
docker build -t ritmo-claro-api .

# Ejecutar (aplica migraciones y arranca el servidor)
docker run --env-file .env -p 3000:3000 ritmo-claro-api
```

El `Dockerfile` instala dependencias de forma reproducible (`npm ci`), genera el cliente Prisma, compila y ejecuta `prisma migrate deploy` antes de arrancar `dist/src/main.js`. El archivo `.env` queda fuera de la imagen gracias a `.dockerignore`.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run start:dev` | Desarrollo con recarga automática |
| `npm run build` | Compila a `dist/` |
| `npm run start:prod` | Ejecuta el build compilado |
| `npm run lint` | Analiza y corrige el código con ESLint |
| `npm run format` | Formatea con Prettier |

## Decisiones de diseño

- **Validación de entradas**: `ValidationPipe` global con `whitelist: true` y `transform: true`; los campos no declarados en el DTO se descartan silenciosamente.
- **Identidad**: `usuarioId` proviene siempre del token JWT, nunca del body del request.
- **Autorización**: `JwtAuthGuard` en todas las rutas de hábitos; `RolesGuard` exige rol `ADMIN` en el listado global; el servicio comprueba propiedad antes de leer, editar o eliminar.
- **Contraseñas**: se almacenan como hash bcrypt y nunca se devuelven en respuestas.
- **Errores inesperados**: el filtro global responde `500` genérico y registra el detalle en los logs del servidor.
