import { useEffect, useState } from 'react';
import AppointmentService from './services/AppointmentService';
import AppointmentsFilterForm from './components/AppointmentsFilterForm';
import AppointmentsTable from './components/AppointmentsTable';

const INITIAL_FILTERS = {
  dni: '',
  specialtyId: '',
  doctorId: '',
  date: '',
};

const PAGE_SIZE = 10;

function AppointmentsSearchPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [appointments, setAppointments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('hace un momento');

  // Carga de especialidades y doctores para los <select>
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [specialtiesData, doctorsData] = await Promise.all([
          AppointmentService.getSpecialties(),
          AppointmentService.getDoctors(),
        ]);
        setSpecialties(specialtiesData);
        setDoctors(doctorsData);
      } catch (err) {
        console.error('Error cargando catálogos de filtros:', err);
      }
    };

    loadCatalogs();
  }, []);

  // Bsqueda paginada cada vez que cambian los filtros aplicados o la página
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await AppointmentService.getAppointmentsBySearch({
          ...appliedFilters,
          pageIndex,
          pageSize: PAGE_SIZE,
        });
        setAppointments(result.items);
        setTotalCount(result.totalCount);
        // Actualizar la hora de la última búsqueda
        setLastUpdated(
          new Date().toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        );
      } catch (err) {
        console.error('Error al buscar citas:', err);
        setError('No se pudieron cargar los registros de citas.');
        setAppointments([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [appliedFilters, pageIndex]);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPageIndex(1);
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setPageIndex(1);
  };

  const handleRemoveSingleFilter = (field) => {
    const updated = { ...appliedFilters, [field]: '' };
    setFilters(updated);
    setAppliedFilters(updated);
    setPageIndex(1);
  };

  const handleSelectAppointment = (item) => {
    alert(
      `Cita ID: ${item.appointmentsId}\nPaciente: ${item.patient?.fullName}`
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </div>

      <AppointmentsFilterForm
        filters={filters}
        appliedFilters={appliedFilters}
        specialties={specialties}
        doctors={doctors}
        loading={loading}
        lastUpdated={lastUpdated}
        onInputChange={handleInputChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        onRemoveSingleFilter={handleRemoveSingleFilter}
      />

      <AppointmentsTable
        appointments={appointments}
        loading={loading}
        error={error}
        fallbackDate={appliedFilters.date}
        pageIndex={pageIndex}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPageChange={setPageIndex}
        onSelectAppointment={handleSelectAppointment}
      />
    </div>
  );
}

export default AppointmentsSearchPage;
