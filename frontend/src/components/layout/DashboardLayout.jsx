import { useState, useMemo, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../features/auth/store';
import { useNotifications } from '../../hooks/useNotifications';
import { useBrowserNotifications } from '../../hooks/useBrowserNotifications';
import { useWebPush } from '../../hooks/useWebPush';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize notifications
  useNotifications();
  useBrowserNotifications(); // Enable native browser notifications
  const { subscribe: subscribeWebPush, isSupported: webPushSupported } = useWebPush();
  
  // Auto-subscribe to Web Push on mount with delay
  useEffect(() => {
    if (webPushSupported) {
      const timer = setTimeout(() => {
        subscribeWebPush().catch(err => {
          console.log('Web Push subscription skipped:', err.message);
        });
      }, 3000); // 3 second delay to allow UI to load
      return () => clearTimeout(timer);
    }
  }, [webPushSupported, subscribeWebPush]);

  // Dynamic navigation based on role
  const navigation = useMemo(() => {
    const baseNav = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['admin', 'technician', 'requester'] },
      { name: 'Configuración', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['admin', 'technician', 'requester'] }
    ];

    // Admin gets everything
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['admin'] },
        { name: 'Activos', href: '/dashboard/assets', icon: WrenchScrewdriverIcon, roles: ['admin'] },
        { name: 'Reportes', href: '/dashboard/reports', icon: ClipboardDocumentListIcon, roles: ['admin'] },
        { name: 'Órdenes', href: '/dashboard/work-orders', icon: ClipboardDocumentListIcon, roles: ['admin'] }, // Changed icon to avoid duplicate Cog6ToothIcon
        { name: 'Usuarios', href: '/dashboard/users', icon: UserGroupIcon, roles: ['admin'] },
        { name: 'Configuración', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['admin'] }
      ];
    }

    // Technician sees work orders and reports
    if (user?.role === 'technician') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['technician'] },
        { name: 'Mis Órdenes', href: '/dashboard/work-orders', icon: WrenchScrewdriverIcon, roles: ['technician'] },
        { name: 'Reportes', href: '/dashboard/reports', icon: ClipboardDocumentListIcon, roles: ['technician'] },
        { name: 'Configuración', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['technician'] }
      ];
    }

    // Requester only sees reports
    return [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['requester'] },
      { name: 'Mis Reportes', href: '/dashboard/reports', icon: ClipboardDocumentListIcon, roles: ['requester'] },
      { name: 'Configuración', href: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['requester'] }
    ];
  }, [user?.role]);

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
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="icon" />
            </button>
            
            {/* Saludo al usuario */}
            <div className="hidden md:block">
              <span className="text-muted text-sm">Hola, </span>
              <span className="font-bold text-main">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-muted hover:text-primary transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <BellIcon className="icon-sm" />
            </button>
            
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-sm">
                {user?.name?.charAt(0)}
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-bold text-main leading-none">{user?.name}</p>
                <p className="text-xs text-muted mt-1 capitalize">{user?.role === 'requester' ? 'Solicitante' : user?.role === 'technician' ? 'Técnico' : 'Admin'}</p>
              </div>
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
