import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { message, Drawer, Button, Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import NavItems from './NavItems'; 
import './Navbar.css';
import logo from '../../assets/logo.webp';

const { useBreakpoint } = Grid;

const Navbar = () => {
   const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const screens = useBreakpoint();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    message.success('Sesión cerrada');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <img src={logo} className="nav-logo" alt="logo" />
        <h1 className="brand-title">Jukebox</h1>
      </Link>

      {/* Escritorio */}
      {screens.md ? (
        <ul className="nav-menu">
          <NavItems user={user} handleLogout={handleLogout} isMobile={false} />
        </ul>
      ) : (
        /* Móvil - Botón */
        <Button type="text" icon={<MenuOutlined style={{color: 'white'}}/>} onClick={() => setMobileMenuOpen(true)} />
      )}

      {/* Menú Lateral Reutilizando NavItems */}
      <Drawer
        title="Jukebox Menu"
        placement="right"
        onClose={closeMenu}
        open={mobileMenuOpen}
        styles={{ body: { backgroundColor: '#1e293b' } }}
      >
        <ul className="mobile-nav-list">
          <NavItems user={user} handleLogout={handleLogout} closeMenu={closeMenu} isMobile={true} />
        </ul>
      </Drawer>
    </nav>
  );
};

export default Navbar;