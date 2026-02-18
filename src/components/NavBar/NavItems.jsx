import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Dropdown } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, IdcardOutlined } from '@ant-design/icons';
import genericUser from '../../assets/genericArtist.png';

const UserMenuDropdown = ({ user, handleLogout, closeMenu }) => {
  const items = [
    {
      key: 'user-info',
      label: (
        <div className="dropdown-user-info">
          <span className="dropdown-username">{user.nombre || user.email}</span>
          <span className="dropdown-email">{user.email}</span>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    ...(user.rol === 'admin' ? [{
      key: 'admin',
      icon: <IdcardOutlined />,
      label: <Link to="/admin" onClick={closeMenu}>Admin</Link>,
    }] : []),
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile" onClick={closeMenu}>Perfil</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings" onClick={closeMenu}>Settings</Link>,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: <span onClick={handleLogout}>Salir</span>,
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="user-dropdown-overlay"
    >
      <button className="user-menu-trigger">
        <Avatar
          size={34}
          src={user.url_foto || genericUser}
          icon={<UserOutlined />}
        />
        <span className="user-trigger-name">{user.nombre || user.email}</span>
        <span className="user-trigger-chevron">&#9660;</span>
      </button>
    </Dropdown>
  );
};

const NavItems = ({ user, handleLogout, closeMenu, isMobile }) => (
  <>
    <li><Link to="/albums" onClick={closeMenu}>Albums</Link></li>
    <li><Link to="/canciones" onClick={closeMenu}>Canciones</Link></li>
    <li><Link to="/search" onClick={closeMenu}>🔍 Buscar</Link></li>

    <hr className={isMobile ? "mobile-divider" : "hidden"} />

    {user ? (
      isMobile ? (
        <li className="mobile-user-group">
          <div className="mobile-user-header">
            <Avatar size={44} src={user.url_foto || genericUser} icon={<UserOutlined />} />
            <div>
              <div className="mobile-user-name">{user.nombre || user.email}</div>
              <div className="mobile-user-email">{user.email}</div>
            </div>
          </div>
          {user.rol === 'admin' && (
            <Link to="/admin" onClick={closeMenu} className="mobile-menu-link">
              <IdcardOutlined /> Admin
            </Link>
          )}
          <Link to="/profile" onClick={closeMenu} className="mobile-menu-link">
            <UserOutlined /> Perfil
          </Link>
          <Link to="/settings" onClick={closeMenu} className="mobile-menu-link">
            <SettingOutlined /> Settings
          </Link>
          <button onClick={handleLogout} className="logout-btn" style={{ marginTop: 12, width: '100%' }}>
            Salir
          </button>
        </li>
      ) : (
        <li>
          <UserMenuDropdown user={user} handleLogout={handleLogout} closeMenu={closeMenu} />
        </li>
      )
    ) : (
      <li><Link to="/Login" className="login-btn" onClick={closeMenu}>Log In</Link></li>
    )}
  </>
);

export default NavItems;