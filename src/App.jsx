// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './test.jsx';
import Navbar from './components/NavBar/NavBar.jsx';
import Login from './pages/Login.jsx';
import AlbumDetalle from './pages/AlbumDetail.jsx';
import { useState } from 'react';
import './App.css';

const NotFound = () => <div style={{color: 'white', padding: '100px'}}>Esta ruta no existe (404)</div>;

function App() {
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('user');
  
  // Si existe en el bolsillo, lo convertimos de texto a objeto
  return savedUser ? JSON.parse(savedUser) : null;
});
  return (
    <Router>
      {/* 1. El Navbar va FUERA de Routes para que sea visible en todas las páginas */}
      <Navbar user={user} setUser={setUser} />

      {/* 2. El contenedor del contenido dinámico */}
      <main className="main-content">
        <Routes>
          {/* Aquí es donde "aterriza" la página según la URL */}
          <Route path="/" element={<Test />} />
          <Route path="/Login" element={<Login setUser={setUser}/>} />
          <Route path="/album/:id" element={<AlbumDetalle />} />
          <Route path="*" element={<NotFound />} /> {/* Agregá esto para debuguear */}

          
          {/* Si el usuario toca "Albums" en el Navbar, Routes cambia lo que hay aquí */}
        </Routes>
      </main>

      {/* 3. Podrías poner un Footer aquí abajo y también sería fijo */}
    </Router>
  );
}

export default App;