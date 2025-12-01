import { useState, useEffect } from 'react';
import { getWorkOrders, updateWorkOrderStatus } from './service';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { CheckCircleIcon, ClockIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

export default function WorkOrdersList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getWorkOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Error al cargar órdenes de trabajo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateWorkOrderStatus(id, newStatus);
      toast.success(`Orden actualizada a ${newStatus}`);
      loadOrders();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar orden';
      toast.error(message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ABIERTO': 
      case 'OPEN': return 'badge-danger';
      case 'ASIGNADO': 
      case 'ASSIGNED': return 'badge-warning';
      case 'EN PROGRESO': 
      case 'IN PROGRESS': return 'badge-primary';
      case 'COMPLETADO': 
      case 'COMPLETED': return 'badge-success';
      default: return 'badge-neutral';
    }
  };

  if (isLoading) return <div className="text-center py-8">Cargando órdenes...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Órdenes de Trabajo</h1>
          <p className="page-subtitle">
            Gestión y seguimiento de mantenimientos asignados.
          </p>
        </div>
      </div>

      <div className="dashboard-grid mb-8">
        <div className="card card-body">
          <div className="stat-label">Pendientes</div>
          <div className="stat-value text-warning">
            {orders.filter(o => o.status === 'ASIGNADO' || o.status === 'ASSIGNED').length}
          </div>
        </div>
        <div className="card card-body">
          <div className="stat-label">En Progreso</div>
          <div className="stat-value text-primary">
            {orders.filter(o => o.status === 'EN PROGRESO' || o.status === 'IN PROGRESS').length}
          </div>
        </div>
        <div className="card card-body">
          <div className="stat-label">Completadas</div>
          <div className="stat-value text-success">
            {orders.filter(o => o.status === 'COMPLETADO' || o.status === 'COMPLETED').length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reporte</th>
                <th>Técnico</th>
                <th>Estado</th>
                <th>Fecha Asignación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-muted">
                    No hay órdenes de trabajo asignadas.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-bold">#{order.id}</td>
                    <td>
                      <div className="text-sm">
                        <span className="font-medium">Reporte #{order.report_id}</span>
                        <p className="text-muted truncate" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.report_description}
                        </p>
                      </div>
                    </td>
                    <td>
                      {order.technician_name || 'Sin asignar'}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {(order.status === 'ASIGNADO' || order.status === 'ASSIGNED') && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'EN PROGRESO')}
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            title="Iniciar Trabajo"
                          >
                            <PlayCircleIcon style={{ width: '16px' }} /> Iniciar
                          </button>
                        )}
                        
                        {(order.status === 'EN PROGRESO' || order.status === 'IN PROGRESS') && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'COMPLETADO')}
                            className="btn btn-success"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#16a34a', color: 'white' }}
                            title="Marcar Completado"
                          >
                            <CheckCircleIcon style={{ width: '16px' }} /> Completar
                          </button>
                        )}

                        {(order.status === 'COMPLETADO' || order.status === 'COMPLETED') && (
                          <span className="text-success flex items-center gap-1">
                            <CheckCircleIcon style={{ width: '20px' }} /> Listo
                          </span>
                        )}
                        
                        {/* Fallback for unknown status */}
                        {!['ASIGNADO', 'ASSIGNED', 'EN PROGRESO', 'IN PROGRESS', 'COMPLETADO', 'COMPLETED', 'ABIERTO', 'OPEN'].includes(order.status) && (
                           <span className="badge badge-gray">{order.status}</span>
                        )}
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
