import React, { useState, useEffect } from 'react';
import { userService } from '../services/AuthService';
import './AdminPanel.css';

interface User {
  uid: string;
  email: string;
  roles: {
    admin: boolean;
  };
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
      setError('');
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (uid: string, currentAdminStatus: boolean) => {
    try {
      await userService.updateUserAdminStatus(uid, !currentAdminStatus);
      
      // Actualizar el estado local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.uid === uid 
            ? { ...user, roles: { admin: !currentAdminStatus } }
            : user
        )
      );
      
      console.log(`Usuario ${uid} ${!currentAdminStatus ? 'promovido a' : 'removido de'} administrador`);
    } catch (error) {
      console.error('Error al actualizar estado de admin:', error);
      setError('Error al actualizar el estado del usuario');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2 className="loading-title">Panel de Administración</h2>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2 className="admin-panel-title">Panel de Administración</h2>
        <p className="admin-panel-description">Gestión de usuarios y roles del sistema</p>
        <button 
          onClick={loadUsers}
          className="refresh-button"
        >
          🔄 Actualizar Lista
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="users-container">
        <h3 className="users-title">Lista de Usuarios</h3>
        
        {users.length === 0 ? (
          <p className="no-users-message">No hay usuarios registrados</p>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead className="table-header">
                <tr>
                  <th>Email</th>
                  <th>¿Es Admin?</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="table-row">
                    <td className="table-cell">
                      <span className="user-email">{user.email}</span>
                    </td>
                    <td className="table-cell table-cell-center">
                      <span className={`admin-badge ${user.roles?.admin ? 'admin-badge-yes' : 'admin-badge-no'}`}>
                        {user.roles?.admin ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="table-cell table-cell-center">
                      <button
                        onClick={() => toggleAdminStatus(user.uid, user.roles?.admin || false)}
                        className={`action-button ${user.roles?.admin ? 'action-button-demote' : 'action-button-promote'}`}
                      >
                        {user.roles?.admin ? 'Quitar Admin' : 'Hacer Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-note">
        <strong>Nota:</strong> Los cambios en los roles se aplican inmediatamente. 
        Los usuarios necesitarán cerrar sesión y volver a iniciarla para ver los cambios reflejados.
      </div>
    </div>
  );
};

export default AdminPanel;