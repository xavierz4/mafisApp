import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadUsers();
  }, [filterRole]);

  const loadUsers = async () => {
    console.log('🔄 Loading users...');
    setIsLoading(true);
    try {
      const params = filterRole !== 'all' ? { role: filterRole } : {};
      console.log('📤 Request params:', params);
      
      const response = await api.get('/users', { params });
      console.log('✅ Response received:', response.data);
      console.log('📊 Number of users:', response.data.length);
      
      setUsers(response.data);
      toast.success(`${response.data.length} usuarios cargados`);
    } catch (error) {
      console.error('❌ Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        fullError: error
      });
      
      if (error.response?.status === 403) {
        toast.error('No tienes permisos para ver la lista de usuarios. Solo los administradores pueden acceder a esta sección.');
      } else if (error.response?.status) {
        const errorMessage = error.response?.data?.message || `Error ${error.response.status}`;
        toast.error(errorMessage);
      } else {
        toast.error('Error de red. Verifica que el servidor esté corriendo.');
      }
    } finally {
      console.log('✅ Loading complete, setting isLoading to false');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('Usuario eliminado');
        loadUsers();
      } catch (error) {
        toast.error('Error al eliminar usuario');
      }
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'badge-primary';
      case 'technician': return 'badge-success';
      case 'requester': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'technician': return 'Técnico';
      case 'requester': return 'Solicitante';
      default: return role;
    }
  };

  if (isLoading) return <div className="text-center py-8">Cargando usuarios...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">
            Administra los usuarios del sistema.
          </p>
        </div>
        <Link to="/dashboard/users/new" className="btn btn-primary">
          <PlusIcon style={{ width: '20px', height: '20px' }} />
          Nuevo Usuario
        </Link>
      </div>

      <div className="card">
        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted">Filtrar por rol:</label>
            <select 
              className="input" 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ maxWidth: '200px', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
            >
              <option value="all">Todos</option>
              <option value="admin">Administradores</option>
              <option value="technician">Técnicos</option>
              <option value="requester">Solicitantes</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-muted">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <UserCircleIcon style={{ width: '24px', color: 'var(--text-muted)' }} />
                        <span className="font-bold">{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${getRoleBadge(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link to={`/dashboard/users/${user.id}/edit`} className="text-primary hover:text-primary-dark" title="Editar">
                          <PencilIcon style={{ width: '20px' }} />
                        </Link>
                        <button onClick={() => handleDelete(user.id)} className="text-danger hover:text-danger-dark" title="Eliminar">
                          <TrashIcon style={{ width: '20px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
