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
import { useState } from 'react';
import './App.css';

const NotFound = () => <div style={{color: 'white', padding: '100px'}}>Esta ruta no existe (404)</div>;

function App() {
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('user');
  
  // Si hay un usuario guardado en localStorage, lo parseamos y lo usamos como estado inicial
  return savedUser ? JSON.parse(savedUser) : null;
});
  return (
    <Router>
      {/* El Navbar va FUERA de Routes para que sea visible en todas las páginas */}
      <Navbar user={user} setUser={setUser} />

      {/* El contenedor del contenido dinámico. Mientras el navbar se queda, este es el que "cambia" de pagina */}
      <main className="main-content">
        <Routes>
          {/* Esto es lo que mostrara el contenedor segun la URL */}
          <Route path="/" element={<Test />} />
          <Route path="/Login" element={<Login setUser={setUser}/>} />
          <Route path="/album/:id" element={<AlbumDetalle />} />
          <Route path="/cancion/:id" element={<SongDetail />} />
          <Route path="/artista/:id" element={<ArtistaDetail />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reviews/:entityType/:id" element={<EntityReviews />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFound />} /> {/* Esto pa debugear */}

        </Routes>
      </main>

      {/* Footer fijo */}
    </Router>
  );
}

export default App;