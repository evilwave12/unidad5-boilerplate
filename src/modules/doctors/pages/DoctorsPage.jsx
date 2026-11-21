import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import NewDoctorForm from '../components/NewDoctorForm';
import DoctorsTable from '../components/DoctorsTable';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { getDoctors, deleteDoctor } from '../services/DoctorsService';

function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  //const [errorMessage, setErrorMessage] = useState('');

  
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

//Handler de crear :p
  const handleDoctorCreated = () => {
    setIsCreateModalOpen(false);
    fetchDoctors();
  };

  // Handler de eliminar
    const handleDoctorDelete = async (doc) => {
      try {
        await deleteDoctor(doc.id);
        if (doctors.length === 1 && pageIndex > 1) {
          setPageIndex(pageIndex - 1);
        } else {
          await fetchDoctors();
        }
    
        setDoctorToDelete(null); // cierra el modal
      } catch (error) {
        if (error.response?.status === 400) {
          alert('El doctor se encuentra inactivo.');
        } else {
          alert('No se pudo eliminar el doctor, inténtelo nuevamente.');
        }
      }
    };
  /*const fetchDoctors = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getDoctors(pageSize, pageIndex);
      console.log('Estructura real de getDoctors:', result);

      const items = Array.isArray(result)
        ? result
        : (result?.data ?? result?.items ?? []);

      setDoctors(items);
      setTotalCount(result?.total ?? result?.totalCount ?? items.length);
    } catch (error) {
      console.error('Error al cargar doctores:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );*/

  const fetchDoctors = useCallback(async () => {
      try {
        setIsLoading(true);
        const result = await getDoctors(
          pageSize,
          pageIndex,
          searchTerm
        );
        /*const items = result.items ?? result.data ?? result ?? [];*/
        setDoctors(result.data ?? []);
        setTotalCount(result.total ?? 0);
      } catch (error) {
        console.error('Error al cargar doctores:', error);
      } finally {
        setIsLoading(false);
      }
    }, [pageIndex, searchTerm]);

    useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  return (
    <div className="flex flex-col gap-6">
      {/* Título y Acciones de Cabecera */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y supervise su disponibilidad actual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Barra de Búsqueda */}
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
              placeholder="Buscar doctor por nombre..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(1); //volver siempre a la página 1
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            //onClick={() => alert('Abrir modal de disponibilidad horaria')}
            onClick={() => navigate('/admin/doctors/availability')}
            className="flex items-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white"
          >
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Agregar Disponibilidad Horaria</span>
          </Button>

          <Button
            onClick={() => handleOpenCreateModal()}
            className="flex items-center gap-1.5 bg-med-primary-700 hover:bg-med-primary-800 text-white"
          >
            <span>+</span>
            <span>Nuevo Doctor</span>
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <DoctorsTable
        doctors={doctors}
        isLoading={isLoading}
        totalCount={totalCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onDelete={(doc) => setDoctorToDelete(doc)} //"botón" de aviso para avisar que se quiere borrar un doctor
      />
{/*Modal de creación de doctor*/}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Doctor"
      >
        <NewDoctorForm
          onSuccess={handleDoctorCreated}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/*Modal de confirmación de borrado*/}
      <Modal
        isOpen={doctorToDelete !== null}
        onClose={() => setDoctorToDelete(null)}
        title="Confirmar Borrado"
      >
        <div className="flex flex-col gap-5">
          <p className="text-sm text-med-text-sub">
            ¿Estás seguro de que querés eliminar{' '}
            <span className="font-semibold text-med-text-main">
              {doctorToDelete?.name}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDoctorToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => handleDoctorDelete(doctorToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DoctorsPage;
