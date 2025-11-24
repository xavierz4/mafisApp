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

  if (isLoading) return <div>Cargando activos...</div>;

  return (
    <div>
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
          <PlusIcon className="icon-sm" style={{ marginRight: '0.5rem' }} />
          Nuevo Activo
        </Link>
      </div>

      {/* Search bar for mobile */}
      <div className="search-bar">
        <MagnifyingGlassIcon className="search-icon" />
        <input
          type="text"
          placeholder="Buscar activo, ubicación o tipo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
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
            {filteredAssets.map((asset) => (
              <tr key={asset.id}>
                <td data-label="Nombre" className="font-bold">
                  {asset.name}
                  {/* Badge only visible on mobile */}
                  <span data-label="Estado" className="mobile-badge">
                    <span className={`badge ${
                      asset.status === 'OPERATIONAL' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {asset.status}
                    </span>
                  </span>
                </td>
                <td data-label="Tipo">{asset.type}</td>
                <td data-label="Ubicación">{asset.location}</td>
                <td data-label="Estado">
                  <span className={`badge ${
                    asset.status === 'OPERATIONAL' ? 'badge-success' : 'badge-danger'
                  }`}>
                    {asset.status}
                  </span>
                </td>
                <td data-label="Acciones">
                  <div className="actions-cell">
                    {/* Desktop: Edit and Delete buttons */}
                    <Link to={`/dashboard/assets/${asset.id}/edit`} className="action-btn action-btn-desktop text-primary">
                      <PencilIcon className="icon-sm" />
                    </Link>
                    <button onClick={() => handleDelete(asset.id)} className="action-btn action-btn-desktop text-danger">
                      <TrashIcon className="icon-sm" />
                    </button>
                    
                    {/* Mobile: Kebab menu with dropdown */}
                    <div className="kebab-menu-container action-btn-mobile">
                      <button 
                        className="action-btn kebab-menu"
                        onClick={(e) => toggleMenu(asset.id, e)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                      </button>
                      
                      {/* Dropdown menu */}
                      {openMenuId === asset.id && (
                        <div className="dropdown-menu">
                          <button 
                            className="dropdown-item"
                            onClick={() => handleEdit(asset.id)}
                          >
                            <PencilIcon className="icon-sm" />
                            Editar
                          </button>
                          <button 
                            className="dropdown-item dropdown-item-danger"
                            onClick={() => handleDelete(asset.id)}
                          >
                            <TrashIcon className="icon-sm" />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAB for mobile */}
      <Link to="/dashboard/assets/new" className="fab-button">
        <PlusIcon />
      </Link>
    </div>
  );
}
