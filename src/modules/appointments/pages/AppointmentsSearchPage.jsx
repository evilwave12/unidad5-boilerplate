import { useEffect, useState } from 'react';
import AppointmentService from '../services/AppointmentService';
import AppointmentsFilterForm from '../components/AppointmentsFilterForm';
import AppointmentsTable from '../components/AppointmentsTable';

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
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [totalCountAppointments, setTotalCountAppointments] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('hace un momento');

  // Carga de especialidades y doctores para los <select>
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setLoadingCatalogs(true);
        const [specialtiesData, doctorsData] = await Promise.all([
          AppointmentService.getSpecialties(),
          AppointmentService.getDoctors(),
        ]);
        setSpecialties(specialtiesData);
        setDoctors(doctorsData);
      } catch (err) {
        console.error('Error cargando catálogos de filtros:', err);
      } finally {
        setLoadingCatalogs(false);
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
        setTotalCountAppointments(result.totalCount);
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
        setTotalCountAppointments(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [appliedFilters, pageIndex]);

  const selectedSpecialtyObj = specialties.find(
    (s) => String(s.specialtyId ?? s.id) === String(filters.specialtyId)
  );

  const filteredDoctors = filters.specialtyId
    ? doctors.filter((doc) => {
        const docSpecialtyId =
          doc.specialtyId ?? doc.specialty?.id ?? doc.specialty?.specialtyId;

        if (docSpecialtyId !== undefined && docSpecialtyId !== null) {
          return String(docSpecialtyId) === String(filters.specialtyId);
        }

        const docSpecialtyName =
          doc.specialty?.name ?? doc.specialty?.specialtyName;
        const targetSpecialtyName =
          selectedSpecialtyObj?.name ?? selectedSpecialtyObj?.specialtyName;

        return Boolean(
          docSpecialtyName &&
            targetSpecialtyName &&
            docSpecialtyName.toLowerCase() === targetSpecialtyName.toLowerCase()
        );
      })
    : doctors;

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'specialtyId' ? { doctorId: '' } : {}),
    }));
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
        doctors={filteredDoctors}
        allDoctors={doctors}
        loading={loading}
        loadingCatalogs={loadingCatalogs}
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
        totalCountAppointments={totalCountAppointments}
        onPageChange={setPageIndex}
        onSelectAppointment={handleSelectAppointment}
      />
    </div>
  );
}

export default AppointmentsSearchPage;