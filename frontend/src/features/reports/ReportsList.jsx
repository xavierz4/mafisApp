import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getReports } from './service';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      toast.error('Error al cargar reportes');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'badge-danger';
      case 'IN_PROGRESS': return 'badge-warning';
      case 'RESOLVED': return 'badge-success';
      case 'CLOSED': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  if (isLoading) return <div>Cargando reportes...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes de Falla</h1>
          <p className="page-subtitle">
            Historial de reportes creados por los usuarios.
          </p>
        </div>
        <div>
          <Link
            to="/dashboard/reports/new"
            className="btn btn-primary"
          >
            <PlusIcon className="icon-sm" style={{ marginRight: '0.5rem' }} />
            Nuevo Reporte
          </Link>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Activo</th>
              <th>Descripción</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td data-label="ID" className="font-bold">
                  #{report.id}
                </td>
                <td data-label="Activo">
                  {report.asset_name || `Activo #${report.asset_id}`}
                </td>
                <td data-label="Descripción" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {report.description}
                </td>
                <td data-label="Prioridad">
                  {report.priority}
                </td>
                <td data-label="Estado">
                  <span className={`badge ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td data-label="Fecha">
                  {format(new Date(report.created_at), 'dd/MM/yyyy HH:mm')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
