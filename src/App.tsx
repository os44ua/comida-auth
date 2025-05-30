// App.tsx
// Componente principal de la aplicación usando Redux Toolkit y Firebase Auth
// Главный компонент приложения использующий Redux Toolkit и Firebase Auth

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes de autenticación
// Компоненты аутентификации
import { AuthProvider } from './contexts/AuthContext';
//import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Componentes existentes de la aplicación
// Существующие компоненты приложения
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import Notifications from './components/Notifications';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';
import logger from './services/logging';
import Navbar from './components/Navbar';

// Componentes temporales hasta que los creemos
// Временные компоненты пока мы их не создадим
// Все компоненты уже созданы!

function App() {
  useEffect(() => {
    logger.info("Aplicación con autenticación iniciada");
    return () => {
      logger.info("🔚 Aplicación finalizada");
    };
  }, []);

  // UI de respaldo para ErrorBoundary
  const errorFallback = (
    <div className="errorFallback">
      <h2>¡Algo salió mal!</h2>
      <p>Ha ocurrido un error inesperado. Por favor, intenta recargar la página.</p>
      <button onClick={() => window.location.reload()}>Recargar página</button>
    </div>
  );

  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary fallback={errorFallback}>
          {/* Componente de notificaciones */}
          <Notifications />
          
          {/* Navbar con autenticación */}
          <Navbar />
          
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;