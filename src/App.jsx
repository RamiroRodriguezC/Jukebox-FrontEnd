// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './test.jsx';
import Navbar from './components/NavBar/NavBar.jsx';
import Login from './pages/Login.jsx';
import AlbumDetalle from './pages/AlbumDetail.jsx';
import SongDetail from './pages/SongDetail.jsx';
import ArtistaDetail from './pages/ArtistaDetails.jsx';
import EntityReviews from './pages/EntityReviews/EntityReviews.jsx';
import Profile from './pages/Profile.jsx';
import SearchPage from './pages/Search/Search.jsx';
import Register from './pages/Register/Register.jsx';
import UserSettings from './pages/UserSettings/UserSettings.jsx';
import NotFound from './pages/NotFound.jsx';
import Home from './pages/Home.jsx';
import './App.css';

function App() {
  return (
    <Router>
      {/* El Navbar va FUERA de Routes para que sea visible en todas las páginas */}
      <Navbar/>

      {/* El contenedor del contenido dinámico. Mientras el navbar se queda, este es el que "cambia" de pagina */}
      <main className="main-content">
        <Routes>
          {/* Esto es lo que mostrara el contenedor segun la URL */}
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/album/:id" element={<AlbumDetalle />} />
          <Route path="/cancion/:id" element={<SongDetail />} />
          <Route path="/artista/:id" element={<ArtistaDetail />} />
          <Route path="/profile/" element={<Profile />} />
          <Route path="/Usuario/:id" element={<Profile />} />
          <Route path="/reviews/:entityType/:id" element={<EntityReviews />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/settings" element={<UserSettings />} />
          <Route path="/test" element={<Test />} /> {/* Esto pa debugear */}
          <Route path="*" element={<NotFound />} /> {/* Esto pa debugear */}

        </Routes>
      </main>

      {/* Footer fijo */}
    </Router>
  );
}

export default App;