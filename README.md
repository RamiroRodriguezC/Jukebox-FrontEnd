# 📖 README: Proyecto Jukebox (Frontend)

Este repositorio contiene el Frontend (API REST) del proyecto "Jukebox", desarrollado como parte del examen parcial de Programación III. La API está construida con Node.js, Express y MongoDB, enfocándose en la gestión de música, usuarios y reseñas, con autenticación basada en JWT.

## ¿Que es Jukebox?

Jukebox es una plataforma social para compartir tu gusto musical, reseñar los albunes y canciones que escuches, descubrir nuevas canciones y llevar el registro de todo el contenido que escuchaste.

## 🚀 Despliegue

## 💻 Tecnologías Utilizadas

- **Node.js:** Entorno de ejecución de backend.
    

## 🛠️ Configuración y Puesta en Marcha

Sigue estos pasos para levantar el servidor localmente y poder interactuar con él.

### Software Requerido

Asegúrate de tener instalado el siguiente software:

- **Node.js:** v22.2.0 o superior
    

### Variables de Entorno

El proyecto requiere un archivo `.env` en el directorio raíz con las siguientes variables:

```
# URL de conexión a el API REST
DB_URL= enlace
```

### Pasos de Instalación

1. **Clonar el repositorio:**
    
    ```
    git clone <URL_DEL_REPOSITORIO_BACKEND>
    ```
    
2. **Ingresar al directorio:**
    
    ```
    cd <NOMBRE_DEL_DIRECTORIO>
    ```
    
3. **Instalar las dependencias:**
    
    ```
    npm install
    ```
    
4. **Crear el archivo `.env`:** Crea el archivo `.env` en la raíz y llénalo con tus propias credenciales (siguiendo el ejemplo de la sección anterior).
    

### Modos de Ejecución

- **Desarrollo (con auto-recarga):**  ->| Utiliza el flag `--watch` nativo de Node.js para reiniciarse automáticamente con cada cambio.| <-
    
    ```
    npm run dev
    ```
    
- **Producción:**
    
    ```
    npm start
    ```
    

El servidor estará disponible en `http://localhost:5173` (o el puerto definido en `.env`).

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura en capas para separar responsabilidades (Modelos, Controladores, Servicios, Rutas).

```
JUKEBOX-FRONTEND/
├── src/
│   ├── config/
│   │   └── db.js               # Configuración de conexión a MongoDB
│   ├── controllers/
│   │   ├── ...Controller.js    # Manejan la lógica de la petición (req, res)
│   ├── middlewares/
│   │   └── authMiddleware.js   # Lógica de autenticación (JWT, roles)
│   ├── models/
│   │   ├── ...Model.js         # Definición de los Schemas de Mongoose
│   ├── routes/
│   │   ├── ...Routes.js        # Definición de los endpoints de la API
│   ├── services/
│   │   ├── ...Service.js       # Lógica de negocio y consultas a la BD
│   │   └── globalService.js    # Funciones genéricas consumidas por otros servicios
│   └── main.jsx                # App principal 
├── .env                        # Archivo de variables de entorno (local)
├── .gitignore
├── package.json                # Dependencias y scripts
└── README.md                   # Esta documentación
```

## 🗃️ Modelo de Datos (MongoDB)

La base de datos `jukebox_db` consta de 5 colecciones. Se utiliza la desnormalización para optimizar consultas comunes.

### `usuarios`

Almacena usuarios, credenciales (hash bcrypt), rol (`admin`, `user`) y un array de `canciones_favoritas` (límite 4, desnormalizado).

- `mail` (String, required, unique)
    
- `passwordHash` (String, required)
    
- `username` (String, required)
    
- `rol` (String, enum: `["admin", "user"]`, default: "user")
    
- `isDeleted` (Boolean, default: false)
    
- `canciones_favoritas` (Array[Object], max: 4)
    
    - `_id` (ObjectId, ref: "Cancion")
        
    - `titulo` (String)
        
    - `autor_nombre` (String)
        
    - `album_portada` (String)
        

### `artistas`

Información sobre los artistas musicales.

- `nombre` (String, required)
    
- `pais` (String, required)
    
- `descripcion` (String, default: "")
    
- `url_foto` (String, default: "")
    
- `isDeleted` (Boolean, default: false)
    

### `albums`

Álbumes musicales. Contiene arrays desnormalizados de `autores` (artistas) y `canciones` (tracklist).

- `titulo` (String, required)
    
- `anio` (Number, required)
    
- `url_portada` (String, default: "")
    
- `isDeleted` (Boolean, default: false)
    
- `autores` (Array[Object])
    
    - `_id` (ObjectId, ref: "Artista")
        
    - `nombre` (String)
        
- `canciones` (Array[Object])
    
    - `_id` (ObjectId, ref: "Cancion")
        
    - `titulo` (String)
        

### `canciones` (Colección 'canciones')

Detalle de canciones. Contiene datos desnormalizados de su `album` y `autores`. Posee un **índice de texto** (`fullTextSearchIndex`) para búsquedas eficientes.

- `titulo` (String, required)
    
- `duracion` (Number, required)
    
- `generos` (Array[String], default: [])
    
- `fecha_salida` (Date, default: null)
    
- `isDeleted` (Boolean, default: false)
    
- `album` (Object)
    
    - `_id` (ObjectId, ref: "Album")
        
    - `titulo` (String)
        
    - `url_portada` (String)
        
- `autores` (Array[Object])
    
    - `_id` (ObjectId, ref: "Artista")
        
    - `nombre` (String)
        

### `reviews`

Colección **polimorfa** que permite reseñar `Canciones` o `Albums` (usando `refPath`). Contiene datos desnormalizados del `autor` (usuario) y de la `entidad_info` (la canción/álbum reseñado).

- `rating` (Number, required, min: 0, max: 5)
    
- `like` (Boolean, default: false)
    
- `comentario` (String)
    
- `isDeleted` (Boolean, default: false)
    
- `autor` (Object)
    
    - `_id` (ObjectId, ref: "Usuario")
        
    - `username` (String)
        
    - `url_profile_photo` (String)
        
- `entidad_tipo` (String, enum: `['Cancion', 'Album']`)
    
- `entidad_id` (ObjectId, refPath: 'entidad_tipo')
    
- `entidad_info` (Object)
    
    - `titulo` (String)
        
    - `autor_nombre` (String)
        
    - `url_portada` (String)
        

## 🌐 Documentación de Endpoints (API REST)

### Autenticación y Seguridad

- La API utiliza **JWT (JSON Web Tokens)** para proteger las rutas.
    
- Las rutas protegidas requieren un `Bearer Token` en el header `Authorization`.
    
- Se manejan 2 roles: `admin` y `user`.
    
- Se implementan middlewares de permisos como `isAdmin` (solo admin), `isSelf` (solo el propio usuario) y `isAuthor` (solo el creador de la review).
    

_(Para ver ejemplos de Request Body y Respuestas, referirse al código fuente)._

### Rutas

A continuación podrás visualizar un resumen de los endpoints de la aplicación.

Podes encontrar la **documentación detallada** en [Jukebox Full Doc](https://documenter.getpostman.com/view/48710464/2sB3WpRMEY).

#### Rutas Públicas

|**Método**|**Ruta**|**Descripción**|
|---|---|---|
|**POST**|`/usuarios/create`|Registra un nuevo usuario.|
|**POST**|`/usuarios/login`|Autentica un usuario y devuelve un JWT.|
|**GET**|`/usuarios/:id`|Obtiene un usuario público por ID.|
|**GET**|`/canciones/search`|Busca canciones por texto (Query: `?q=...`).|
|**GET**|`/canciones/`|Obtiene todas las canciones.|
|**GET**|`/canciones/:id`|Obtiene una canción por ID.|
|**GET**|`/canciones/reviews/:id`|Obtiene todas las reviews de una canción.|
|**GET**|`/artistas/`|Obtiene todos los artistas.|
|**GET**|`/artistas/:id`|Obtiene un artista por ID.|
|**GET**|`/albums/`|Obtiene todos los álbumes.|
|**GET**|`/albums/:id`|Obtiene un álbum por ID.|
|**GET**|`/reviews/`|Obtiene todas las reviews.|
|**GET**|`/reviews/:id`|Obtiene una review por ID.|

#### Rutas de Usuario Autenticado

|**Método**|**Ruta**|**Descripción**|
|---|---|---|
|**POST**|`/usuarios/:idUser/favorito/:idCancion`|Añade una canción a favoritos (permiso: `isSelf`).|
|**PUT**|`/usuarios/:id`|Actualiza datos del usuario (permiso: `isSelf`).|
|**DELETE**|`/usuarios/:idUser/favorito/:idCancion`|Elimina una canción de favoritos (permiso: `isSelf`).|
|**DELETE**|`/usuarios/:id`|Borrado lógico de un usuario (permiso: `isSelf`).|
|**POST**|`/reviews/create`|Crea una nueva review (para Canción o Album).|
|**PUT**|`/reviews/:id`|Actualiza una review (permiso: `isAuthor`).|
|**DELETE**|`/reviews/:id`|Borrado lógico de una review (permiso: `isAuthor`).|

#### Rutas de Administrador

| **Método** | **Ruta**               | **Descripción**                |
| ---------- | ---------------------- | ------------------------------ |
| **GET**    | `/usuarios/`           | Obtiene todos los usuarios.    |
| **GET**    | `/usuarios/mail/:mail` | Busca un usuario por email.    |
| **DELETE** | `/canciones/:id`       | Borrado lógico de una canción. |
| **DELETE** | `/artistas/:id`        | Borrado lógico de un artista.  |
| **DELETE** | `/albums/:id`          | Borrado lógico de un álbum.    |


## Funcionalidades Pendientes
- [ ] Mejorar la funcion searchSongs para que tambien busque albunes y artistas coincidentes.
- [ ] Agregar el procesamiento de imagenes.
