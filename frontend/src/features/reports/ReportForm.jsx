import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createReport, getReport, updateReport } from './service';
import { getAssets } from '../assets/service';
import toast from 'react-hot-toast';

export default function ReportForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    asset_id: '',
    description: '',
    priority: 'MEDIA'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAssets();
    if (isEditMode) {
      loadReportData();
    }
  }, [id]);

  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
      // Only set default asset if NOT in edit mode
      if (!isEditMode && data.length > 0) {
        setFormData(prev => ({ ...prev, asset_id: data[0].id }));
      }
    } catch (error) {
      toast.error('Error al cargar activos');
    }
  };

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      const data = await getReport(id);
      setFormData({
        asset_id: data.asset_id,
        description: data.description,
        priority: data.priority
      });
    } catch (error) {
      toast.error('Error al cargar el reporte');
      navigate('/dashboard/reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditMode) {
        await updateReport(id, formData);
        toast.success('Reporte actualizado exitosamente');
      } else {
        await createReport(formData);
        toast.success('Reporte creado exitosamente');
      }
      navigate('/dashboard/reports');
    } catch (error) {
      toast.error(isEditMode ? 'Error al actualizar reporte' : 'Error al crear reporte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="asset-form-container">
      <h1 className="asset-form-header">
        {isEditMode ? 'Editar Reporte de Falla' : 'Nuevo Reporte de Falla'}
      </h1>
      
      <form onSubmit={handleSubmit} className="asset-form-card">
        <div className="asset-form-group">
          <label htmlFor="asset_id" className="asset-form-label">Activo Afectado</label>
          <select
            name="asset_id"
            id="asset_id"
            required
            value={formData.asset_id}
            onChange={handleChange}
            className="input"
            disabled={isEditMode} // Usually you don't change the asset of a report
          >
            <option value="">Seleccione un activo</option>
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.location})
              </option>
            ))}
          </select>
        </div>

        <div className="asset-form-group">
          <label htmlFor="description" className="asset-form-label">Descripción del Problema</label>
          <textarea
            name="description"
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="input"
            placeholder="Describa detalladamente la falla observada..."
          />
        </div>

        <div className="asset-form-group">
          <label htmlFor="priority" className="asset-form-label">Prioridad Percibida</label>
          <select
            name="priority"
            id="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input"
          >
            <option value="BAJA">Baja - No afecta operación</option>
            <option value="MEDIA">Media - Afecta parcialmente</option>
            <option value="ALTA">Alta - Detiene operación</option>
          </select>
        </div>

        <div className="asset-form-actions">
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar Reporte' : 'Enviar Reporte')}
          </button>
        </div>
      </form>
    </div>
  );
}
