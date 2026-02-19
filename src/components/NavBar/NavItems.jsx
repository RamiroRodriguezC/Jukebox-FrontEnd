import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Dropdown } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, IdcardOutlined } from '@ant-design/icons';
import genericUser from '../../assets/genericArtist.png';


const NavItems = ({ user, handleLogout, closeMenu, isMobile }) => {
  const userMenuItems = user ? [
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
      label: <Link to="/profile/settings" onClick={closeMenu}>Settings</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: <span onClick={handleLogout}>Salir</span>,
    },
  ] : [];

  return (
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
            {/* Mapeamos el mismo array en lugar de duplicar el JSX */}
            {userMenuItems.map(item => (
              <div key={item.key} className="mobile-menu-link" style={item.danger ? {color: '#ef4444'} : {}}>
                {item.icon} {item.label}
              </div>
            ))}
          </li>
        ) : (
          <li>
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <button className="user-menu-trigger">
                <Avatar size={34} src={user.url_profile_photo || genericUser} icon={<UserOutlined />} />
                <span className="user-trigger-name">{user.nombre || user.email}</span>
                <span className="user-trigger-chevron">&#9660;</span>
              </button>
            </Dropdown>
          </li>
        )
      ) : (
        <li><Link to="/Login" className="login-btn" onClick={closeMenu}>Log In</Link></li>
      )}
    </>
  );
};

export default NavItems;