import useAuthStore from '../../features/auth/store';

export default function DashboardHome() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div style={{ marginTop: '1rem' }}>
        <p>Bienvenido, {user?.name}.</p>
        <p className="page-subtitle">
          Selecciona una opción del menú para comenzar.
        </p>
        
        <div className="dashboard-stats-grid">
          {/* Stats placeholders */}
          <div className="stat-card">
            <dt className="stat-label">Reportes Pendientes</dt>
            <dd className="stat-value">0</dd>
          </div>
          <div className="stat-card">
            <dt className="stat-label">Órdenes Abiertas</dt>
            <dd className="stat-value">0</dd>
          </div>
          <div className="stat-card">
            <dt className="stat-label">Activos Registrados</dt>
            <dd className="stat-value">0</dd>
          </div>
        </div>
      </div>
    </div>
  );
}
