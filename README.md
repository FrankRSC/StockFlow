# StockFlow

Sistema de gestión de inventario para el control de productos, sucursales, stock y movimientos de mercancía.

🚀 **Despliegue en producción:** [StockFlow en Vercel](https://stock-flow-omega.vercel.app/login)

> ⚠️ **Nota sobre el plan gratuito de Render:** Debido a las limitaciones del plan gratuito de Render, el backend puede entrar en modo de hibernación por inactividad. Si es la primera vez que accedes a la aplicación o tras un periodo de inactividad, la primera petición puede tardar entre **1 y 10 minutos** en responder mientras el servidor se "despierta".


## Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** (incluido con Node.js)
- **MongoDB** (Instancia local o en la nube como MongoDB Atlas)

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:
- `backend/`: Servidor API REST construido con Node.js, Express y Mongoose.
- `frontend/`: Aplicación web interactiva construida con Next.js.



## Configuración y Ejecución

### 1. Configurar y Ejecutar el Backend

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:
   ```env
   PORT=5000
   MONGODB_URI=tu_cadena_de_conexion_mongodb
   ```

4. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   El backend correrá en `http://localhost:5000`.

### 2. Configurar y Ejecutar el Frontend

1. Abre una nueva terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env.local` en la carpeta `frontend/` con el siguiente contenido:
   ```env
   BACKEND_URL=http://127.0.0.1:5000
   NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
   ```

4. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:3000`.

## Ejecución con Docker (Recomendado)

Si prefieres usar Docker para levantar todo el sistema automáticamente:

1. Asegúrate de tener **Docker** y **Docker Compose** instalados.
2. Desde la carpeta raíz del proyecto, ejecuta:
   ```bash
   docker-compose up --build
   ```
3. Este comando iniciará:
   - **MongoDB**: En `localhost:27017`.
   - **Backend**: En `http://localhost:5000`.
   - **Frontend**: En `http://localhost:3000`.

*Nota: Los cambios que realices en el código se reflejarán automáticamente sin necesidad de reconstruir los contenedores.*

---

## Pruebas Automatizadas

El sistema incluye pruebas automatizadas para el backend utilizando **Jest** y **Supertest**.

Para ejecutar las pruebas:
1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Ejecuta el comando de pruebas:
   ```bash
   npm test
   ```

Las pruebas cubren:
- **Autorización JWT**: Verificación de acceso a rutas protegidas.
- **Productos**: Creación de nuevos productos.
- **Sucursales (Branches)**: Creación de nuevas sucursales.

---

## Scripts Disponibles

### Backend
- `npm run dev`: Ejecuta el servidor con `nodemon` para reinicio automático.
- `npm start`: Ejecuta el servidor en producción.
- `npm test`: Ejecuta las pruebas automatizadas con Jest.

### Frontend
- `npm run dev`: Inicia el servidor de desarrollo de Next.js.
- `npm run build`: Compila la aplicación para producción.
- `npm start`: Inicia la aplicación compilada.

