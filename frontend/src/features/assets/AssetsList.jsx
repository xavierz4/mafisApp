import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getAssets, deleteAsset } from './service';
import toast from 'react-hot-toast';

export default function AssetsList() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.kebab-menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (error) {
      toast.error('Error al cargar activos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este activo?')) {
      try {
        await deleteAsset(id);
        toast.success('Activo eliminado');
        loadAssets();
      } catch (error) {
        toast.error('Error al eliminar activo');
      }
    }
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/assets/${id}/edit`);
    setOpenMenuId(null);
  };

  const toggleMenu = (id, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="text-center py-8">Cargando activos...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activos</h1>
          <p className="page-subtitle">
            Lista de todos los equipos, ubicaciones y servicios registrados.
          </p>
        </div>
        <Link
          to="/dashboard/assets/new"
          className="btn btn-primary"
        >
          <PlusIcon style={{ width: '20px', height: '20px' }} />
          Nuevo Activo
        </Link>
      </div>

      <div className="card">
        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div className="search-bar" style={{ maxWidth: '400px', width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '0.375rem' }}>
            <MagnifyingGlassIcon style={{ width: '20px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar activo, ubicación o tipo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted">
                    No se encontraron activos.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="font-bold">{asset.name}</td>
                    <td>{asset.type}</td>
                    <td>{asset.location}</td>
                    <td>
                      <span className={`badge ${
                        asset.status === 'OPERATIONAL' ? 'badge-success' : 'badge-danger'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link to={`/dashboard/assets/${asset.id}/edit`} className="text-primary hover:text-primary-dark" title="Editar">
                          <PencilIcon style={{ width: '20px' }} />
                        </Link>
                        <button onClick={() => handleDelete(asset.id)} className="text-danger hover:text-danger-dark" title="Eliminar">
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
    </div>
  );
}
