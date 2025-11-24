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
    priority: 'MEDIUM'
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Nuevo Reporte de Falla</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="asset_id" className="block text-sm font-medium text-gray-700">Activo Afectado</label>
          <select
            name="asset_id"
            id="asset_id"
            required
            value={formData.asset_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
          >
            <option value="">Seleccione un activo</option>
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.location})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción del Problema</label>
          <textarea
            name="description"
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
            placeholder="Describa detalladamente la falla observada..."
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Prioridad Percibida</label>
          <select
            name="priority"
            id="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
          >
            <option value="LOW">Baja - No afecta operación</option>
            <option value="MEDIUM">Media - Afecta parcialmente</option>
            <option value="HIGH">Alta - Detiene operación</option>
            <option value="CRITICAL">Crítica - Riesgo de seguridad</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports')}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-secondary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </div>
      </form>
    </div>
  );
}
