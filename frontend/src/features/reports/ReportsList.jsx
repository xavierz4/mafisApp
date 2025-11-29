import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { getReports, deleteReport } from './service';
import { getUsers, createWorkOrder } from '../work_orders/service';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null); // For modal
  const [selectedTech, setSelectedTech] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadReports();
    loadTechnicians();
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

  const loadTechnicians = async () => {
    try {
      const data = await getUsers('technician');
      setTechnicians(data);
    } catch (error) {
      console.error('Error loading technicians:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este reporte?')) {
      try {
        await deleteReport(id);
        toast.success('Reporte eliminado');
        loadReports();
      } catch (error) {
        toast.error('Error al eliminar reporte');
      }
    }
  };

  const openAssignModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
    setSelectedTech(''); // Reset selection
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTech) {
      toast.error('Selecciona un técnico');
      return;
    }

    try {
      await createWorkOrder({
        report_id: selectedReport.id,
        technician_id: selectedTech,
        notes: `Orden generada automáticamente desde reporte #${selectedReport.id}`
      });
      toast.success('Orden de trabajo creada y asignada');
      setIsModalOpen(false);
      loadReports(); // Refresh to see status change
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear orden');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ABIERTO': return 'badge-danger';
      case 'EN PROGRESO': return 'badge-warning';
      case 'RESUELTO': return 'badge-success';
      case 'CERRADO': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  if (isLoading) return <div className="text-center py-8">Cargando reportes...</div>;

  return (
    <div className="page-container">
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
            <PlusIcon style={{ width: '20px', height: '20px' }} />
            Nuevo Reporte
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Activo</th>
                <th>Descripción</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-muted">
                    No hay reportes registrados.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id}>
                    <td className="font-bold">#{report.id}</td>
                    <td>{report.asset_name || `Activo #${report.asset_id}`}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {report.description}
                    </td>
                    <td>{report.priority}</td>
                    <td>
                      <span className={`badge ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      {format(new Date(report.created_at), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {/* Assign Button (Only if OPEN) */}
                        {report.status === 'ABIERTO' && (
                          <button 
                            onClick={() => openAssignModal(report)} 
                            className="text-primary hover:text-primary-dark"
                            title="Asignar Técnico / Crear Orden"
                          >
                            <WrenchScrewdriverIcon style={{ width: '20px' }} />
                          </button>
                        )}
                        
                        {/* Edit Button */}
                        <Link to={`/dashboard/reports/${report.id}/edit`} className="text-primary hover:text-primary-dark" title="Editar">
                          <PencilIcon style={{ width: '20px' }} />
                        </Link>
                        
                        {/* Delete Button */}
                        <button onClick={() => handleDelete(report.id)} className="text-danger hover:text-danger-dark" title="Eliminar">
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

      {/* Modal de Asignación */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-bold mb-4">Asignar Orden de Trabajo</h2>
            <p className="mb-4 text-muted">
              Creando orden para reporte <strong>#{selectedReport?.id}</strong> - {selectedReport?.asset_name}
            </p>
            
            <form onSubmit={handleAssign}>
              <div className="form-group mb-4">
                <label className="label">Seleccionar Técnico</label>
                <select 
                  className="input" 
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  required
                >
                  <option value="">-- Seleccione --</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} ({tech.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirmar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
