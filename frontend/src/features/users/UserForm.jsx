import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'requester',
    phone: '',
    is_active: true
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      const user = response.data;
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Don't load password
        role: user.role,
        phone: user.phone || '',
        is_active: user.is_active
      });
    } catch (error) {
      toast.error('Error al cargar usuario');
      navigate('/dashboard/users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        // Update user - don't send password if empty
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        delete updateData.email; // Email shouldn't be updated
        
        await api.put(`/users/${id}`, updateData);
        toast.success('Usuario actualizado exitosamente');
      } else {
        // Create user - password is required
        if (!formData.password) {
          toast.error('La contraseña es requerida');
          setIsLoading(false);
          return;
        }
        await api.post('/users', formData);
        toast.success('Usuario creado exitosamente');
      }
      navigate('/dashboard/users');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <button
            onClick={() => navigate('/dashboard/users')}
            className="btn btn-secondary mb-2"
          >
            <ArrowLeftIcon className="icon-sm" />
            Volver
          </button>
          <h1 className="page-title">
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h1>
          <p className="page-subtitle">
            {isEditing ? 'Actualiza la información del usuario' : 'Completa el formulario para crear un nuevo usuario'}
          </p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label className="label" htmlFor="name">
                Nombre Completo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej: Juan Pérez"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="label" htmlFor="email">
                Correo Electrónico <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isEditing}
                placeholder="usuario@ejemplo.com"
              />
              {isEditing && (
                <small className="text-muted">El email no puede ser modificado</small>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="label" htmlFor="password">
                Contraseña {!isEditing && <span className="text-danger">*</span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="input"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"}
                minLength={6}
              />
              {isEditing && (
                <small className="text-muted">Dejar en blanco para mantener la contraseña actual</small>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="label" htmlFor="phone">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="3001234567"
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="label" htmlFor="role">
                Rol <span className="text-danger">*</span>
              </label>
              <select
                id="role"
                name="role"
                className="input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="requester">Solicitante</option>
                <option value="technician">Técnico</option>
                <option value="admin">Administrador</option>
              </select>
              <small className="text-muted">
                {formData.role === 'admin' && 'Acceso total al sistema'}
                {formData.role === 'technician' && 'Puede gestionar órdenes de trabajo'}
                {formData.role === 'requester' && 'Puede crear reportes de fallas'}
              </small>
            </div>

            {/* Active Status */}
            {isEditing && (
              <div className="form-group">
                <label className="label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Usuario Activo
                </label>
                <small className="text-muted">
                  Los usuarios inactivos no pueden iniciar sesión
                </small>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard/users')}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar Usuario' : 'Crear Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
