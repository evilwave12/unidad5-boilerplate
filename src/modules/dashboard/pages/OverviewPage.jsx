import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import DashboardTable from '../components/DashboardTable';
import DashboardCards from '../components/DashboardCards';
import { useState, useEffect, useCallback } from 'react';
import { getDoctors } from '../../doctors/services/DoctorsService';
import { getSpecialties } from '../../specialties/services/SpecialtiesService';
import { getAppointmentsBySearch } from '../../appointments/services/AppointmentService';

function OverviewPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const [totalCountDoctors, setTotalCountDoctors] = useState(0);
  const [totalDoctorsGlobal, setTotalDoctorsGlobal] = useState(0);
  const [totalCountSpecialties, setTotalCountSpecialties] = useState(0);
  const [totalCountAppointments, setTotalCountAppointments] = useState(0);

  const fetchDoctors = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getDoctors(pageSize, pageIndex, searchTerm);
      /*const items = result.items ?? result.data ?? result ?? [];*/
      setDoctors(result.data ?? []);
      setTotalCountDoctors(result.total ?? 0);
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

  useEffect(() => {
    const fetchTotalDoctors = async () => {
      try {
        const result = await getDoctors(1, 1);
        setTotalDoctorsGlobal(result?.total ?? result?.length ?? 0);
      } catch (error) {
        console.error('Error al cargar doctores:', error);
      }
    };
    fetchTotalDoctors();
  }, []);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const result = await getSpecialties(1, 1);
        setTotalCountSpecialties(result?.total ?? result?.length ?? 0);
      } catch (error) {
        console.error('Error al cargar especialidades:', error);
      }
    };
    fetchSpecialties();
  }, []);

  useEffect(() => {
  const fetchAppointments = async () => {
    try {
      const result = await getAppointmentsBySearch({
        pageIndex: 1,
        pageSize: 1,
      });
      setTotalCountAppointments(result?.totalCount ?? 0);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  };
  fetchAppointments();
}, []);

  // handler del buscador
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPageIndex(1);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header con Título y Acciones Principales */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Vista General de Gestión
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Configure el personal médico y las especialidades del departamento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => navigate('/admin/doctors')}
            className="flex items-center gap-2"
          >
            <span>+</span>
            <span>Agregar Nuevo Doctor</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/admin/specialties')}
            className="flex items-center gap-2"
          >
            <span>+</span>
            <span>Agregar Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      <DashboardCards
        totalCountDoctors={totalDoctorsGlobal}
        totalCountSpecialties={totalCountSpecialties}
        totalCountAppointments={totalCountAppointments}
      />

      {/* Directorio de Profesionales Médicos (Tabla Resumen) */}
      <Card className="p-0 overflow-hidden border-med-border">
        <DashboardTable
          doctors={doctors}
          isLoading={isLoading}
          totalCountDoctors={totalCountDoctors}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onDetail={() => navigate('/admin/doctors')}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </Card>
    </div>
  );
}

export default OverviewPage;
