import React from 'react';
import { Link } from 'react-router-dom';

const NavItems = ({ user, handleLogout, closeMenu, isMobile }) => (
  <>
    <li><Link to="/albums" onClick={closeMenu}>Albums</Link></li>
    <li><Link to="/canciones" onClick={closeMenu}>Canciones</Link></li>
    <li><Link to="/search" onClick={closeMenu}>🔍 Buscar</Link></li>
    
    <hr className={isMobile ? "mobile-divider" : "hidden"} />

    {user ? (
      <li className={isMobile ? "mobile-user-group" : "user-dropdown-container"}>
        {/* Aquí podrías mantener tu lógica de dropdown para desktop o links planos para móvil */}
        <span className="user-greet">Hola, {user.nombre}</span>
        {user.rol === 'admin' && <Link to="/admin" onClick={closeMenu}>Admin</Link>}
        <Link to="/profile" onClick={closeMenu}>Perfil</Link>
        <button onClick={handleLogout} className="logout-btn">Salir</button>
      </li>
    ) : (
      <li><Link to="/Login" className="login-btn" onClick={closeMenu}>Log In</Link></li>
    )}
  </>
);

export default NavItems;