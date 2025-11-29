import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport } from './service';
import { getAssets } from '../assets/service';
import toast from 'react-hot-toast';

export default function ReportForm() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    asset_id: '',
    description: '',
    priority: 'MEDIA'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, asset_id: data[0].id }));
      }
    } catch (error) {
      toast.error('Error al cargar activos');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createReport(formData);
      toast.success('Reporte creado exitosamente');
      navigate('/dashboard/reports');
    } catch (error) {
      toast.error('Error al crear el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="asset-form-container">
      <h1 className="asset-form-header">Nuevo Reporte de Falla</h1>
      
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
            {isLoading ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </div>
      </form>
    </div>
  );
}
