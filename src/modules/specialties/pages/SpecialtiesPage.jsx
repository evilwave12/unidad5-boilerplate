import { useState, useEffect, useCallback } from 'react';
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import NewSpecialtiesForm from '../components/NewSpecialtiesForm';
import SpecialtiesTable from '../components/SpecialtiesTable';
import { SpecialtiesService } from '../services/SpecialtiesService';

function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);

  // Estados para búsqueda y paginación
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para crear
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const pageSize = 10;

  const fetchSpecialties = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await SpecialtiesService.getSpecialties(
        pageSize,
        pageIndex,
        searchTerm
      );
      /*const items = result.items ?? result.data ?? result ?? [];*/
      setSpecialties(result.data ?? []);
      setTotalCount(result.total ?? 0);
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, searchTerm]);

  /*useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);*/

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSpecialties();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchSpecialties]);

  //Handler de crear :p
  const handleCreatedSuccess = () => {
    setIsCreateModalOpen(false);
    fetchSpecialties();
  };

  // Handler de eliminar
  const handleOpenDelete = async (spec) => {
    try {
      await SpecialtiesService.deleteSpecialty(spec.id);

      //si el elemento era el unico en una pagina, retrocede.
      if (specialties.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
      } else {
        await fetchSpecialties();
      }

      alert('La especialidad fue eliminada correctamente.');
    } catch (error) {
      if (error.response?.status === 409) {
        alert('La especialidad se encuentra inactiva.');
      } else {
        alert('No se pudo eliminar la especialidad, intentelo nuevamente.');
      }
    }
  };

  /*const filteredSpecialties = specialties.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );*/

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas, servicios y disponibilidad del
            personal especializado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar especialidad..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(1); //volver siempre a la página 1
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-med-primary-700 hover:bg-med-primary-800 text-white"
          >
            <span>+</span>
            <span>Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <SpecialtiesTable
        specialties={specialties}
        isLoading={isLoading}
        totalCount={totalCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onDelete={handleOpenDelete}
      />

      {/* Modal de creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nueva Especialidad"
      >
        <NewSpecialtiesForm
          onSuccess={handleCreatedSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default SpecialtiesPage;
