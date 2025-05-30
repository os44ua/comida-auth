import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/AuthService';
import '../App.css';
import { Role } from '../services/IAuthService';

const Navbar: React.FC = () => {
  const { user, roles } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-menu">
        <li><Link to="/">Home</Link></li>
        {user && <li><Link to="/dashboard">Dashboard</Link></li>}
        {user && roles && roles.includes(Role.ADMIN) && (
          <li><Link to="/admin">Admin</Link></li>
        )}
        {!user && <li><Link to="/login">Login</Link></li>}
        {!user && <li><Link to="/register">Registro</Link></li>}
        {user && <li><button onClick={handleLogout}>Logout</button></li>}
      </ul>
    </nav>
  );
};

export default Navbar;