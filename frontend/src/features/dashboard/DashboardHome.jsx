import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../auth/store';
import { getReports } from '../reports/service';
import { getWorkOrders } from '../work_orders/service';
import { getAssets } from '../assets/service';
import toast from 'react-hot-toast';
import ReportsStatusChart from './charts/ReportsStatusChart';
import WorkOrdersPieChart from './charts/WorkOrdersPieChart';
import TrendsChart from './charts/TrendsChart';

export default function DashboardHome() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalReports: 0,
    openReports: 0,
    totalOrders: 0,
    myOrders: 0,
    totalAssets: 0,
    inProgressOrders: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [myRecentOrders, setMyRecentOrders] = useState([]);
  const [reports, setReports] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load data based on role
      const [reportsData, ordersData, assetsData] = await Promise.all([
        getReports().catch(() => []),
        getWorkOrders().catch(() => []),
        getAssets().catch(() => [])
      ]);

      // Filter data based on role
      let filteredReports = reportsData;
      if (user?.role === 'requester') {
        // Requesters only see their own reports
        filteredReports = reportsData.filter(r => r.requester_id === user.id);
      }

      // Store full arrays for charts (admin/technician) or filtered (requester)
      setReports(filteredReports);
      setOrders(ordersData);

      // Calculate stats
      const openReports = filteredReports.filter(r => r.status === 'ABIERTO');
      const myOrders = ordersData.filter(o => o.technician_id === user?.id);
      const inProgressOrders = ordersData.filter(o => o.status === 'EN PROGRESO');

      setStats({
        totalReports: filteredReports.length,
        openReports: openReports.length,
        totalOrders: ordersData.length,
        myOrders: myOrders.length,
        totalAssets: assetsData.length,
        inProgressOrders: inProgressOrders.length
      });

      // Recent data
      setRecentReports(filteredReports.slice(0, 5));
      setMyRecentOrders(myOrders.slice(0, 5));
    } catch (error) {
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando dashboard...</div>;
  }

  // Admin Dashboard
  if (user?.role === 'admin') {
    // Prepare chart data
    const reportsChartData = {
      open: stats.openReports,
      inProgress: reports.filter(r => r.status === 'EN PROGRESO').length,
      resolved: reports.filter(r => r.status === 'RESUELTO').length,
      closed: reports.filter(r => r.status === 'CERRADO').length
    };

    const ordersChartData = {
      assigned: orders.filter(o => o.status === 'ASIGNADO').length,
      inProgress: stats.inProgressOrders,
      completed: orders.filter(o => o.status === 'COMPLETADO').length
    };

    // Mock trends data (in real app, calculate from historical data)
    const trendsData = [
      { month: 'Ene', reports: 12, orders: 8 },
      { month: 'Feb', reports: 15, orders: 10 },
      { month: 'Mar', reports: 18, orders: 14 },
      { month: 'Abr', reports: 14, orders: 12 },
      { month: 'May', reports: 20, orders: 16 },
      { month: 'Jun', reports: reports.length, orders: orders.length }
    ];

    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard Administrativo</h1>
            <p className="page-subtitle">Bienvenido, {user?.name}. Vista general del sistema.</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="card card-body">
            <div className="stat-label">Reportes Abiertos</div>
            <div className="stat-value text-danger">{stats.openReports}</div>
            <Link to="/dashboard/reports" className="btn-link">
              Ver todos →
            </Link>
          </div>
          <div className="card card-body">
            <div className="stat-label">Órdenes en Progreso</div>
            <div className="stat-value text-warning">{stats.inProgressOrders}</div>
            <Link to="/dashboard/work-orders" className="btn-link">
              Gestionar →
            </Link>
          </div>
          <div className="card card-body">
            <div className="stat-label">Activos Totales</div>
            <div className="stat-value text-primary">{stats.totalAssets}</div>
            <Link to="/dashboard/assets" className="btn-link">
              Ver inventario →
            </Link>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <ReportsStatusChart data={reportsChartData} />
          <WorkOrdersPieChart data={ordersChartData} />
        </div>

        <div className="mt-4">
          <TrendsChart data={trendsData} />
        </div>

        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Reportes Recientes</h2>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Activo</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map(report => (
                    <tr key={report.id}>
                      <td>#{report.id}</td>
                      <td>{report.asset_name}</td>
                      <td>
                        <span className={`badge ${
                          report.status === 'ABIERTO' ? 'badge-danger' : 
                          report.status === 'EN PROGRESO' ? 'badge-warning' : 'badge-success'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td>{report.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Technician Dashboard
  if (user?.role === 'technician') {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard del Técnico</h1>
            <p className="page-subtitle">Bienvenido, {user?.name}. Tus órdenes de trabajo.</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="card card-body">
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="icon-sm text-warning" style={{ width: '24px' }} />
              <div className="stat-label">Mis Órdenes Pendientes</div>
            </div>
            <div className="stat-value text-warning">
              {myRecentOrders.filter(o => o.status === 'ASIGNADO').length}
            </div>
          </div>
          <div className="card card-body">
            <div className="flex items-center gap-2 mb-2">
              <WrenchScrewdriverIcon className="icon-sm text-primary" style={{ width: '24px' }} />
              <div className="stat-label">En Progreso</div>
            </div>
            <div className="stat-value text-primary">
              {myRecentOrders.filter(o => o.status === 'EN PROGRESO').length}
            </div>
          </div>
          <div className="card card-body">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="icon-sm text-success" style={{ width: '24px' }} />
              <div className="stat-label">Completadas Hoy</div>
            </div>
            <div className="stat-value text-success">
              {myRecentOrders.filter(o => o.status === 'COMPLETADO').length}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Mis Órdenes Recientes</h2>
              <Link to="/dashboard/work-orders" className="btn btn-primary">
                Ver Todas
              </Link>
            </div>
            
            <div className="card-body">
              {myRecentOrders.length === 0 ? (
                <div className="empty-state">
                  <CheckCircleIcon />
                  <p>No tienes órdenes asignadas en este momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRecentOrders.map(order => (
                    <div key={order.id} className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">Orden #{order.id}</h3>
                          <p className="text-sm text-muted">{order.report_description}</p>
                        </div>
                        <span className={`badge ${
                          order.status === 'ASIGNADO' ? 'badge-warning' :
                          order.status === 'EN PROGRESO' ? 'badge-info' : 'badge-success'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Requester Dashboard
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard del Solicitante</h1>
          <p className="page-subtitle">Bienvenido, {user?.name}. Estado de tus reportes.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card card-body">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardDocumentListIcon className="icon-sm text-primary" style={{ width: '24px' }} />
            <div className="stat-label">Mis Reportes</div>
          </div>
          <div className="stat-value text-primary">{stats.totalReports}</div>
        </div>
        <div className="card card-body">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="icon-sm text-danger" style={{ width: '24px' }} />
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="stat-value text-danger">{stats.openReports}</div>
        </div>
        <div className="card card-body">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="icon-sm text-success" style={{ width: '24px' }} />
            <div className="stat-label">Resueltos</div>
          </div>
          <div className="stat-value text-success">
            {stats.totalReports - stats.openReports}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="section-title mb-4">Acciones Rápidas</h2>
        
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Link to="/dashboard/reports/new" className="card card-body hover-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
                <ClipboardDocumentListIcon className="icon text-primary" style={{ width: '32px', height: '32px' }} />
              </div>
              <div>
                <h3 className="font-bold">Nuevo Reporte</h3>
                <p className="text-sm text-muted">Reportar una falla o problema</p>
              </div>
            </div>
          </Link>
          
          <Link to="/dashboard/reports" className="card card-body hover-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
                <ClockIcon className="icon text-warning" style={{ width: '32px', height: '32px' }} />
              </div>
              <div>
                <h3 className="font-bold">Mis Reportes</h3>
                <p className="text-sm text-muted">Ver estado de mis solicitudes</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
