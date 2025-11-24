import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../features/auth/store';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Activos', href: '/dashboard/assets', icon: WrenchScrewdriverIcon },
  { name: 'Reportes', href: '/dashboard/reports', icon: ClipboardDocumentListIcon },
  { name: 'Órdenes', href: '/dashboard/work-orders', icon: ClipboardDocumentListIcon },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 25 }}
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        />
      )}

      {/* Sidebar - Desktop Only */}
      <div className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="dashboard-sidebar-header">
          <span>MAFIS MVP</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden sidebar-close-btn"
          >
            <XMarkIcon className="icon" />
          </button>
        </div>
        
        <nav className="dashboard-sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`dashboard-sidebar-link ${location.pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="icon-sm" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            <ArrowRightOnRectangleIcon className="icon-sm" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            type="button"
            className="lg:hidden mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Bars3Icon className="icon" />
          </button>

          <div className="flex items-center gap-4">
            <button className="text-muted" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <BellIcon className="icon-sm" style={{ color: 'var(--text-muted)' }} />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>

        {/* Bottom Navigation - Mobile Only */}
        <nav className="bottom-nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`bottom-nav-item ${location.pathname === item.href ? 'active' : ''}`}
            >
              <item.icon className="bottom-nav-icon" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
