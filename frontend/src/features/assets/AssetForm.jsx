import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAsset, getAsset, updateAsset } from './service';
import toast from 'react-hot-toast';

export default function AssetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'EQUIPMENT',
    location: '',
    status: 'OPERATIONAL',
    criticality: 'MEDIUM'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadAsset();
    }
  }, [id]);

  const loadAsset = async () => {
    try {
      const data = await getAsset(id);
      setFormData({
        name: data.name,
        description: data.description || '',
        type: data.type,
        location: data.location || '',
        status: data.status,
        criticality: data.criticality
      });
    } catch (error) {
      toast.error('Error al cargar el activo');
      navigate('/dashboard/assets');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateAsset(id, formData);
        toast.success('Activo actualizado');
      } else {
        await createAsset(formData);
        toast.success('Activo creado');
      }
      navigate('/dashboard/assets');
    } catch (error) {
      toast.error('Error al guardar el activo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="asset-form-container">
      <h1 className="asset-form-header">
        {isEditing ? 'Editar Activo' : 'Nuevo Activo'}
      </h1>
      
      <form onSubmit={handleSubmit} className="asset-form-card">
        <div className="asset-form-group">
          <label htmlFor="name" className="asset-form-label">Nombre</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="asset-form-group">
          <label htmlFor="description" className="asset-form-label">Descripción</label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="asset-form-row">
          <div className="asset-form-group">
            <label htmlFor="type" className="asset-form-label">Tipo</label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="input"
            >
              <option value="EQUIPMENT">Equipo</option>
              <option value="LOCATIVE">Locativo</option>
              <option value="SERVICE">Servicio</option>
            </select>
          </div>

          <div className="asset-form-group">
            <label htmlFor="location" className="asset-form-label">Ubicación</label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="asset-form-group">
            <label htmlFor="status" className="asset-form-label">Estado</label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="OPERATIONAL">Operativo</option>
              <option value="DOWN">Fuera de Servicio</option>
              <option value="MAINTENANCE">En Mantenimiento</option>
            </select>
          </div>

          <div className="asset-form-group">
            <label htmlFor="criticality" className="asset-form-label">Criticidad</label>
            <select
              name="criticality"
              id="criticality"
              value={formData.criticality}
              onChange={handleChange}
              className="input"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
        </div>

        <div className="asset-form-actions">
          <button
            type="button"
            onClick={() => navigate('/dashboard/assets')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
