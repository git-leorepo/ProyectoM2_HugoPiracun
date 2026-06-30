# 📚 Proyecto Integrador 2 - API de Publicaciones

Una API REST desarrollada con **Node.js + Express + PostgreSQL** para administrar **autores** y **posts** de una plataforma de publicaciones.

## 🚀 Descripción general

Este proyecto expone endpoints CRUD para:
- **Autores**
- **Posts**
- **Estado de salud de la API**
- **Documentación interactiva** con Swagger UI

## 🧱 Tecnologías utilizadas

- **Node.js**
- **Express**
- **PostgreSQL**
- **pg** (cliente PostgreSQL)
- **Swagger UI**
- **Vitest** (testing)
- **dotenv**

## 📁 Estructura del proyecto

```text
.
├── index.js
├── openapi.yaml
├── package.json
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── config.js
│   │   └── validateEnv.js
│   ├── controllers/
│   │   ├── authors.controlers.js
│   │   └── posts.controlers.js
│   ├── data/
│   │   ├── authors.js
│   │   └── posts.js
│   ├── db/
│   │   ├── config.js
│   │   └── setup.sql
│   ├── routes/
│   │   ├── author.routes.js
│   │   └── post.routes.js
│   └── test/
│       ├── authors.test.js
│       ├── env-config.test.js
│       ├── posts.test.js
│       └── vitest.config.js
```

## ⚙️ Requisitos previos

Antes de ejecutar el proyecto necesitas tener instalado:

- **Node.js** (versión recomendada: 18+)
- **PostgreSQL**
- **Git**

## 🛠️ Instalación local

1. Clona el repositorio:

```bash
git clone https://github.com/git-leorepo/ProyectoM2_HugoPiracun.git
cd Proyecto_Integrador2
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea una base de datos en PostgreSQL:

```sql
CREATE DATABASE proyecto_integrador2;
```

4. Ejecuta el script SQL para crear tablas y datos de ejemplo:

```bash
psql -U postgres -d proyecto_integrador2 -f src/db/setup.sql
```

5. Crea un archivo `.env` en la raíz del proyecto con las variables necesarias:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/proyecto_integrador2
```

> Si prefieres usar variables separadas, también puedes definir:
>
> - `DB_HOST`
> - `DB_PORT`
> - `DB_NAME`
> - `DB_USER`
> - `DB_PASSWORD`

## ▶️ Ejecutar el proyecto localmente

### Modo desarrollo

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

Por defecto el servidor corre en:

```text
http://localhost:3001
```

## 📘 Documentación Swagger

La documentación interactiva está disponible en:

```text
http://localhost:3001/api-docs
```

## 🔍 Endpoints disponibles

### Health Check

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Verifica que la API esté funcionando |

### Autores

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/authors` | Crear un autor |
| GET | `/authors` | Obtener todos los autores |
| GET | `/authors/:id` | Obtener un autor por ID |
| PUT | `/authors/:id` | Actualizar un autor |
| DELETE | `/authors/:id` | Eliminar un autor |

### Posts

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/posts` | Crear un post |
| GET | `/posts` | Obtener todos los posts |
| GET | `/posts/:id` | Obtener un post por ID |
| GET | `/posts/author/:authorId` | Obtener todos los posts de un autor |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post |

## 🧪 Ejemplos de uso

### Crear un autor

```bash
curl -X POST http://localhost:3001/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana García",
    "email": "ana@example.com",
    "bio": "Desarrolladora backend"
  }'
```

### Obtener todos los autores

```bash
curl http://localhost:3001/authors
```

### Obtener un autor por ID

```bash
curl http://localhost:3001/authors/1
```

### Crear un post

```bash
curl -X POST http://localhost:3001/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introducción a Node.js",
    "content": "Node.js permite ejecutar JavaScript fuera del navegador",
    "author_id": 1,
    "published": true
  }'
```

### Obtener todos los posts

```bash
curl http://localhost:3001/posts
```

### Obtener posts por autor

```bash
curl http://localhost:3001/posts/author/1
```

## 📦 Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `PORT` | No | Puerto del servidor |
| `NODE_ENV` | No | Entorno de ejecución (`development`, `test`, `production`) |
| `DATABASE_URL` | Sí para Railway/producción | Cadena de conexión PostgreSQL |
| `DB_HOST` | No | Host de PostgreSQL |
| `DB_PORT` | No | Puerto de PostgreSQL |
| `DB_NAME` | No | Nombre de la base de datos |
| `DB_USER` | No | Usuario de PostgreSQL |
| `DB_PASSWORD` | No | Contraseña de PostgreSQL |
| `CORS_ORIGIN` | No | Origen permitido para CORS |

## 🧪 Ejecutar tests

```bash
npm test
```

Para una ejecución específica:

```bash
npx vitest run src/test/authors.test.js
npx vitest run src/test/posts.test.js
```

## 🚢 Despliegue en Railway (paso a paso)

### 1. Crear una cuenta en Railway

1. Ve a https://railway.app
2. Inicia sesión con GitHub
3. Crea un nuevo proyecto

### 2. Conectar el repositorio

1. En Railway, selecciona **New Project**
2. Elige **Deploy from GitHub repo**
3. Selecciona el repositorio de tu API
4. Espera a que Railway detecte el proyecto

### 3. Agregar PostgreSQL

1. En el panel del proyecto, haz clic en **New**
2. Selecciona **Database** → **Add PostgreSQL**
3. Railway creará una base de datos PostgreSQL y te dará una variable de entorno llamada:
   - `DATABASE_URL`

### 4. Configurar variables de entorno

En la pestaña **Variables** del servicio de la API, agrega o ajusta:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

> Si Railway no inyecta automáticamente la URL, puedes copiar la `DATABASE_URL` del servicio PostgreSQL.

### 5. Configurar el start command

En el servicio de la API:

1. Ve a **Settings**
2. En **Start Command**, escribe:

```bash
npm start
```

### 6. Ejecutar migraciones / creación de tablas

Railway no ejecuta automáticamente el archivo `src/db/setup.sql` al hacer deploy. Para preparar la base de datos:

1. Abre la base de datos PostgreSQL desde Railway
2. Usa el panel de **Query**
3. Ejecuta el contenido de [src/db/setup.sql](src/db/setup.sql)

### 7. Hacer deploy

1. Haz clic en **Deploy**
2. Espera a que el servicio se construya y levante
3. Obtén la URL pública del servicio generado por Railway

### 8. Probar el despliegue

```bash
curl https://tu-app.up.railway.app/health
```

### 9. URL para probar en railway

```bash
https://proyectom2hugopiracun-production.up.railway.app/posts
https://proyectom2hugopiracun-production.up.railway.app/authors
```

## 🔐 Consideraciones de seguridad

- Usa `DATABASE_URL` en producción en lugar de credenciales fijas.
- No expongas claves sensibles en el código fuente.
- En producción, el proyecto debe usar `NODE_ENV=production`.

## 📌 Notas importantes

- La API utiliza el archivo [openapi.yaml](openapi.yaml) para generar la documentación Swagger.
- El endpoint `/api-docs` muestra la documentación interactiva.
- Si no existe una base de datos válida, la API puede fallar al intentar conectarse.

## ✅ Resultado esperado

Una vez levantada la API, podrás acceder a:

- `http://localhost:3001/health` en desarrollo
- `http://localhost:3001/api-docs` para Swagger
- `https://tu-app.up.railway.app/health` en producción
