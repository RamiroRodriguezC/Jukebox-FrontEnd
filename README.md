# 📖 README: Proyecto Jukebox (Frontend)

Este repositorio contiene el frontend del proyecto **Jukebox**, desarrollado como trabajo final de Programación III. Es una SPA (Single Page Application) construida con React + Vite que consume la [API REST de Jukebox](https://jukebox-rpt0.onrender.com), permitiendo a los usuarios explorar música, reseñar álbumes y canciones, y gestionar sus listas de favoritos.

## ¿Qué es Jukebox?

Jukebox es una plataforma social para compartir tu gusto musical. Podés reseñar los álbumes y canciones que escuchés, descubrir nuevos artistas, y llevar el registro de todo el contenido que escuchaste.

---

## 🚀 Despliegue

La aplicación está desplegada y lista para usarse en:

**URL:** [jukebox-frontend.vercel.app](https://jukebox-front-end.vercel.app/) 

> [!CAUTION] **Mensajes de Commit:** La primera request enviada a la API REST de Jukebox despues de un determinado tiempo de inactividad, demorara alrrededor de 30 segundos en dar respuesta (Es lo que render demora en ponerse en marcha)

---

## 💻 Tecnologías Utilizadas

### Dependencias de producción

| Librería | Versión | Propósito |
|---|---|---|
| **React** | ^19.2.0 | Librería principal para construir la interfaz de usuario mediante componentes reutilizables |
| **React DOM** | ^19.2.0 | Paquete complementario de React que permite montar la aplicación en el DOM del navegador |
| **React Router DOM** | ^7.13.0 | Gestión del enrutamiento del lado del cliente (SPA). Permite navegar entre páginas sin recargar el navegador |
| **Axios** | ^1.13.4 | Cliente HTTP para realizar peticiones a la API REST del backend. Permite configurar interceptores globales para adjuntar el token JWT automáticamente |
| **Ant Design** | ^6.2.2 | Librería de componentes UI. Se utiliza para `message`, `Avatar`, `Drawer`, `Card`, `Tag`, `Grid`, `Dropdown` y `Spin` |
| **@ant-design/icons** | ^6.1.0 | Paquete de íconos oficial de Ant Design. Provee íconos como `UserOutlined`, `MenuOutlined`, `LogoutOutlined`, entre otros |
| **Lucide React** | ^0.563.0 | Librería de íconos SVG (Star, Heart, Trash2, etc.) utilizados en las cards de reseñas y otros componentes |

### Dependencias de desarrollo

| Librería | Versión | Propósito |
|---|---|---|
| **Vite** | ^7.2.4 | Herramienta de build y servidor de desarrollo. Ofrece arranque instantáneo y hot-reload mediante ES Modules nativos |
| **@vitejs/plugin-react** | ^5.1.1 | Plugin oficial de Vite para soportar JSX y Fast Refresh en React |
| **ESLint** | ^9.39.1 | Linter estático para detectar errores y mantener consistencia en el código JavaScript **(preConfigurado por Vite)** | 
| **eslint-plugin-react-hooks** | ^7.0.1 | Reglas de ESLint específicas para validar el uso correcto de los Hooks de React |
| **eslint-plugin-react-refresh** | ^0.4.24 | Reglas de ESLint para garantizar compatibilidad con el Fast Refresh de Vite |

---

## 🛠️ Configuración y Puesta en Marcha

### Software Requerido

- **Node.js:** v18.0.0 o superior
- **npm:** v9.0.0 o superior (se instala con Node.js)
- **Git:** Para clonar el repositorio

### Variables de Entorno

El proyecto requiere un archivo `.env` en el directorio raíz (`/frontend`) con la siguiente variable:

```
# URL base de la API REST del backend
VITE_API_URL=https://jukebox-rpt0.onrender.com
```

> Para desarrollo local, reemplazá el valor por el puerto donde corra el backend (Si la app no encuentra la variable, por defecto intentara enviar las request a `http://localhost:4000` ).

### Pasos de Instalación

1. **Clonar el repositorio:**
    ```bash
    git clone https://github.com/RamiroRodriguezC/Jukebox-FrontEnd
    ```

2. **Instalar las dependencias:**
    ```bash
    npm install
    ```

3. **Crear el archivo `.env`:** Creá el archivo `.env` en la raíz de `/frontend` con la variable indicada arriba.

### Modos de Ejecución

- **Desarrollo (con hot-reload):**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`

- **Build de producción:**
    ```bash
    npm run build
    ```
    Genera los archivos optimizados en la carpeta `/dist`

- **Preview del build:**
    ```bash
    npm run preview
    ```
    Sirve el build de producción localmente para verificarlo antes de desplegar

---

## 📂 Estructura del Proyecto

```
frontend/
├── public/                   # Archivos estáticos públicos (No utilizada)
├── src/
│   ├── api/
│   │   └── api.js            # Instancia global de Axios con baseURL e interceptor JWT
│   │
│   ├── assets/               # Imágenes estáticas (logo, avatares genéricos, mascota Rocky)
│   │
│   ├── components/           # Componentes reutilizables en múltiples páginas
│   │   ├── AboutArtistSection/   # Sección biográfica del artista con imagen de fondo
│   │   ├── EntityHeader/         # Header genérico (Details de álbum, canción, artista, usuario)
│   │   ├── NavBar/               # Barra de navegación con menú responsive y desplegable de usuario
│   │   ├── ReviewSection/        # Sección de reseñas con resumen de rating y formulario
│   │   ├── ReviewsScroll/        # Lista vertical de reseñas (usada en EntityReviews)
│   │   ├── Search/               # Componentes de la barra y navegación de búsqueda
│   │   ├── TopArtistAlbums/      # Grid de álbumes destacados del artista
│   │   ├── TopFiveSection/       # Grid de top 5 favoritos del perfil de usuario
│   │   ├── TopTracksSection/     # Sección de canciones destacadas del artista
│   │   ├── TrackList/            # Tracklist de un álbum con duración y canción activa
│   │   └── cards/                # Cards individuales: AlbumCard, ArtistCard, ReviewCard,
│   │                             # TrackCard, OwnReview (review propia con editar/eliminar)
│   │
│   ├── config/
│   │   └── constants.js      # Constantes globales (API_URL con fallback a localhost)
│   │
│   ├── context/
│   │   └── AuthContext.jsx   # Context de autenticación: estado del usuario, login() y logout()
│   │
│   ├── hooks/
│   │   └── useFetch.js       # Hook genérico para GET requests con estados loading/error/data
│   │
│   ├── pages/                # Vistas completas, una por ruta de React Router
│   │   ├── Home/             # Página principal con Hero, álbumes recientes y artistas
│   │   │   └── components/   # Subcomponentes exclusivos de Home (Hero, AlbumesRecientes, etc.)
│   │   ├── Search/           # Página de búsqueda global por categoría
│   │   ├── Register/         # Formulario de registro de nuevo usuario
│   │   ├── UserSettings/     # Configuración de cuenta del usuario
│   │   │   └── sections/     # Secciones de settings: Profile, Account, Favorites, Danger
│   │   ├── AlbumDetail.jsx   # Detalle de álbum con tracklist y reseñas
│   │   ├── SongDetail.jsx    # Detalle de canción con tracklist del álbum y reseñas
│   │   ├── ArtistaDetails.jsx# Detalle del artista con álbumes y biografía
│   │   ├── ArtistaAlbums.jsx # Discografía completa del artista con estadísticas
│   │   ├── EntityReviews.jsx # Lista completa de reseñas de una entidad (álbum o canción)
│   │   ├── Profile.jsx       # Perfil público de usuario con sus listas de favoritos
│   │   ├── Login.jsx         # Formulario de inicio de sesión
        ├── Mantenimiento     # Pagina para las rutas o funcines en curso de implementacion
│   │   └── NotFound.jsx      # Página 404
│   │
│   ├── services/             # Funciones de acceso a la API (capa de servicio)
│   │   ├── AuthService.js    # login: POST /usuarios/login
│   │   └── DeleteUserService.js # deleteUser: DELETE /usuarios/:id
│   │
│   ├── styles/
│   │   └── Ui.css            # Estilos globales reutilizables: formularios, botones, feedback
│   │
│   ├── App.jsx               # Componente raíz: define todas las rutas con React Router
│   ├── index.css             # Estilos globales base: variables CSS, reset, fondo, layout
│   └── main.jsx              # Punto de entrada: monta React con AuthProvider
│
├── .env                      # Variables de entorno locales (no se sube al repositorio)
├── .gitignore
├── index.html                # HTML base de la SPA
├── package.json              # Dependencias y scripts
└── vite.config.js            # Configuración de Vite
```

---

## 🔐 Autenticación

La app gestiona la sesión mediante **JWT**:

- Al hacer login, el token y los datos del usuario se guardan en `localStorage`.
- El interceptor de Axios en `api.js` adjunta automáticamente el token en el header `Authorization: Bearer <token>` de cada petición.
- El `AuthContext` expone `user`, `login()` y `logout()` a todos los componentes.
- Al cerrar sesión o al expirar el token (1h), el estado se limpia y el usuario es redirigido.

---

## 🌐 Conexión con el Backend

Todas las peticiones se realizan a través de la instancia de Axios configurada en `src/api/api.js`. La URL base se lee desde la variable de entorno `VITE_API_URL`.

Para más detalle sobre los endpoints disponibles, consultá la [documentación del backend](https://github.com/RamiroRodriguezC/Jukebox-BackEnd/blob/main/README.md).