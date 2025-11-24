import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import useAuthStore from './store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    } else {
      toast.error('Credenciales inválidas');
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
            Inicio de sesión
          </h2>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email-address" className="login-label">
                Correo electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-label">
                Contraseña
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="input"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>

          <div className="login-footer-links">
            <Link to="/register" className="login-footer-link">
              Crear cuenta
            </Link>
            <span className="login-footer-separator">|</span>
            <Link to="/forgot-password" className="login-footer-link">
              Olvidé mi contraseña
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
