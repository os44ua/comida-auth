import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Role } from '../services/IAuthService';

const Home: React.FC = () => {
  const { user, roles } = useContext(AuthContext);

  // Si el usuario está autenticado, mostrar pantalla de bienvenida personalizada
  if (user) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>¡Bienvenido de vuelta, {user.email}!</h2>
        
        <div style={{ margin: '2rem 0' }}>
          <p>¿Qué te gustaría hacer hoy?</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/dashboard" 
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '1rem 2rem',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease'
            }}
          >
            🍽️ Hacer Pedido
          </Link>

          {roles && roles.includes(Role.ADMIN) && (
            <Link 
              to="/admin" 
              style={{
                background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
                color: 'white',
                textDecoration: 'none',
                padding: '1rem 2rem',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
            >
              ⚙️ Panel Admin
            </Link>
          )}
        </div>

        <div style={{ marginTop: '2rem', color: '#666' }}>
          <p>Rol actual: {roles?.includes(Role.ADMIN) ? 'Administrador' : 'Usuario'}</p>
        </div>
      </div>
    );
  }

  // Si el usuario NO está autenticado, mostrar pantalla de bienvenida con opciones de login
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Bienvenido a Comida Rápida Online</h2>
      
      <div style={{ margin: '2rem 0' }}>
        <p>Inicia sesión para acceder al sistema de pedidos.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link 
          to="/login" 
          style={{
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            textDecoration: 'none',
            padding: '1rem 2rem',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease'
          }}
        >
          🔑 Iniciar Sesión
        </Link>

        <Link 
          to="/register" 
          style={{
            background: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)',
            color: 'white',
            textDecoration: 'none',
            padding: '1rem 2rem',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease'
          }}
        >
          📝 Registrarse
        </Link>
      </div>

      <div style={{ marginTop: '2rem', color: '#666' }}>
        <p>¡Regístrate para disfrutar de nuestras deliciosas comidas!</p>
      </div>
    </div>
  );
};

export default Home;