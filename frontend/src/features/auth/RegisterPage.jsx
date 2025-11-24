import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import useAuthStore from './store';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'requester' // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      toast.success('Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } else {
      toast.error('Error en el registro');
    }
  };

  return (
    <div className="login-gradient">
      <div className="login-content-wrapper">
        <div className="login-brand-header">
          <div className="brand-circle">
            SENA
          </div>
          <h1 className="login-title-main">
            MAFIS
          </h1>
          <p className="login-subtitle-main">
            Sistema de Gestión de Mantenimiento de Activos Fijos
          </p>
          <p className="login-subtitle-secondary">
            Servicio Nacional de Aprendizaje
          </p>
          <h2 className="login-section-title">
            Crear una cuenta nueva
          </h2>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="name" className="login-label">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input"
                placeholder="Nombre Completo"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="email-address" className="login-label">Correo electrónico</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="input"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="phone" className="login-label">Teléfono</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input"
                placeholder="Teléfono (para WhatsApp)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="password" className="login-label">Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="input"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="icon-sm" />
                  ) : (
                    <EyeIcon className="icon-sm" />
                  )}
                </button>
              </div>
            </div>



            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary login-submit-btn"
                style={{ backgroundColor: 'var(--primary-blue)', borderColor: 'var(--primary-blue)' }}
              >
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className="login-footer-links">
            <span style={{ color: '#6b7280' }}>¿Ya tienes cuenta?</span>
            <Link to="/login" className="login-footer-link">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
