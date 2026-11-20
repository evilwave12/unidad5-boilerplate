import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import {
  getAllDoctors,
  getDoctorAvailabilities,
  saveDoctorAvailabilities,
} from '../services/DoctorsService';

const INITIAL_DAYS = [
  {
    key: 'LUNES',
    label: 'Lunes',
    active: false,
    startTime: '08:00',
    endTime: '16:00',
  },
  {
    key: 'MARTES',
    label: 'Martes',
    active: false,
    startTime: '08:00',
    endTime: '16:00',
  },
  {
    key: 'MIÉRCOLES',
    label: 'Miércoles',
    active: false,
    startTime: '08:00',
    endTime: '16:00',
  },
  {
    key: 'JUEVES',
    label: 'Jueves',
    active: false,
    startTime: '08:00',
    endTime: '16:00',
  },
  {
    key: 'VIERNES',
    label: 'Viernes',
    active: false,
    startTime: '08:00',
    endTime: '16:00',
  },
  {
    key: 'SÁBADO',
    label: 'Sábado',
    active: false,
    startTime: '08:00',
    endTime: '12:00',
  },
  {
    key: 'DOMINGO',
    label: 'Domingo',
    active: false,
    startTime: '08:00',
    endTime: '12:00',
  },
];

// Normaliza tildes y mayúsculas para comparar días sin errores ("MIÉRCOLES" === "MIERCOLES")
const normalizeDay = (dayStr = '') =>
  dayStr
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();

function NewAvailabilityForm() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [daysSchedule, setDaysSchedule] = useState(INITIAL_DAYS);
  const [isUpdate, setIsUpdate] = useState(false);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Cargar lista de médicos al montar el componente
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const list = await getAllDoctors();
        setDoctors(list);
        if (list.length > 0) {
          setSelectedDoctorId(list[0].id);
        }
      } catch {
        setErrorMessage('No se pudo cargar la lista de profesionales.');
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // 2. Cargar disponibilidades cuando cambia el médico seleccionado
  useEffect(() => {
    if (!selectedDoctorId) return;

    const fetchAvailabilities = async () => {
      try {
        setLoadingSchedule(true);
        setErrorMessage('');
        setSuccessMessage('');

        const existingDays = await getDoctorAvailabilities(selectedDoctorId);

        // Si el array trae registros, ya tiene disponibilidad este mes -> usamos PUT
        setIsUpdate(existingDays.length > 0);

        // Mapear la tabla activando solo los días que devolvió el backend
        const updatedTable = INITIAL_DAYS.map((dayItem) => {
          const found = existingDays.find(
            (d) => normalizeDay(d.day) === normalizeDay(dayItem.key)
          );

          if (found) {
            return {
              ...dayItem,
              active: true,
              // .slice(0, 5) asegura formato "HH:mm" aunque C# devuelva "HH:mm:ss"
              startTime: found.startTime?.slice(0, 5) || '08:00',
              endTime: found.endTime?.slice(0, 5) || '16:00',
            };
          }

          return { ...dayItem, active: false };
        });

        setDaysSchedule(updatedTable);
      } catch {
        setErrorMessage(
          'Error al obtener la disponibilidad del médico seleccionado.'
        );
        setDaysSchedule(INITIAL_DAYS);
        setIsUpdate(false);
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchAvailabilities();
  }, [selectedDoctorId]);

  const selectedDoctor = doctors.find(
    (d) => String(d.id) === String(selectedDoctorId)
  );

  // Activar / desactivar switch de un día
  const handleToggleDay = (dayKey) => {
    setDaysSchedule((prev) =>
      prev.map((item) =>
        item.key === dayKey ? { ...item, active: !item.active } : item
      )
    );
  };

  // Cambiar hora de entrada o salida
  const handleTimeChange = (dayKey, field, value) => {
    setDaysSchedule((prev) =>
      prev.map((item) =>
        item.key === dayKey ? { ...item, [field]: value } : item
      )
    );
  };

  // Guardar cambios (POST o PUT según isUpdate)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedDoctorId) {
      setErrorMessage('Debe seleccionar un profesional.');
      return;
    }

    const activeDays = daysSchedule.filter((d) => d.active);

    if (!isUpdate && activeDays.length === 0) {
      setErrorMessage(
        'Debe activar al menos un día de atención para crear la disponibilidad.'
      );
      return;
    }

    // Validar que startTime < endTime en todos los días activos
    for (const day of activeDays) {
      if (!day.startTime || !day.endTime || day.startTime >= day.endTime) {
        setErrorMessage(
          `El horario de entrada debe ser menor al de salida en el día ${day.label}.`
        );
        return;
      }
    }

    const payload = {
      doctorId: selectedDoctorId,
      days: activeDays.map((d) => ({
        dayOfTheWeek: d.key,
        startTime: d.startTime,
        endTime: d.endTime,
      })),
    };

    try {
      setIsSubmitting(true);
      await saveDoctorAvailabilities(payload, isUpdate);
      setIsUpdate(activeDays.length > 0);
      setSuccessMessage('Disponibilidad horaria guardada correctamente.');
    } catch (error) {
      const backendMsg = error.response?.data?.message;
      setErrorMessage(
        backendMsg ||
          'No se pudo guardar la disponibilidad. Verifique los datos.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      {/* Columna Izquierda: Selector de Médico y Tarjeta Informativa */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <div className="bg-white border border-med-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-main">
              Seleccionar Profesional
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              disabled={loadingDoctors || isSubmitting}
              className="w-full border border-med-border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
            >
              {doctors.length === 0 && (
                <option value="">
                  {loadingDoctors
                    ? 'Cargando médicos...'
                    : 'Sin médicos registrados'}
                </option>
              )}
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}{' '}
                  {doc.specialty?.name ? `- ${doc.specialty.name}` : ''}
                </option>
              ))}
            </select>
          </div>

          {selectedDoctor && (
            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-lg bg-med-primary-600/10 text-med-primary-900 flex items-center justify-center font-bold text-lg shrink-0">
                {selectedDoctor.name?.charAt(0) || 'D'}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-med-primary-900 truncate">
                  {selectedDoctor.name}
                </p>
                <p className="text-xs text-med-text-muted truncate">
                  {selectedDoctor.specialty?.name || 'Especialidad General'}
                </p>
                <p className="text-xs text-med-primary-600 font-medium mt-0.5">
                  Sede Central
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 bg-slate-50 border border-med-border rounded-xl p-4 text-xs text-med-text-muted leading-relaxed">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <p>
            Los cambios realizados se aplicarán a partir de la próxima semana
            calendario. Las citas ya programadas no se verán afectadas
            automáticamente.
          </p>
        </div>
      </div>

      {/* Columna Derecha: Tabla de Configuración de Horarios */}
      <div className="lg:col-span-8 bg-white border border-med-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-b border-med-border">
            <h3 className="font-bold text-lg text-med-primary-900">
              Configuración de Horarios
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-med-text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Intervalos automáticos de 30 minutos
            </span>
          </div>

          {loadingSchedule ? (
            <div className="p-8 text-center text-sm text-med-text-muted">
              Cargando disponibilidad del profesional...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-med-border text-[11px] font-bold text-med-text-muted uppercase">
                    <th className="py-3 px-6">Día</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Entrada</th>
                    <th className="py-3 px-6">Salida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border text-sm">
                  {daysSchedule.map((item) => (
                    <tr
                      key={item.key}
                      className={
                        !item.active ? 'bg-slate-50/50 text-med-text-muted' : ''
                      }
                    >
                      <td className="py-3.5 px-6 font-medium text-med-text-main">
                        {item.label}
                      </td>

                      {/* Switch Activo / Inactivo */}
                      <td className="py-3.5 px-4">
                        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.active}
                            onChange={() => handleToggleDay(item.key)}
                          />
                          <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative peer-checked:bg-med-primary-600" />
                          <span
                            className={`text-xs font-semibold ${
                              item.active
                                ? 'text-med-primary-600'
                                : 'text-slate-400'
                            }`}
                          >
                            {item.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </label>
                      </td>

                      {/* Hora de Entrada */}
                      <td className="py-3.5 px-4">
                        <input
                          type="time"
                          step="1800"
                          disabled={!item.active}
                          value={item.active ? item.startTime : ''}
                          onChange={(e) =>
                            handleTimeChange(
                              item.key,
                              'startTime',
                              e.target.value
                            )
                          }
                          className="border border-med-border rounded-lg px-3 py-1.5 text-xs bg-white text-med-text-main disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-med-primary-600"
                        />
                      </td>

                      {/* Hora de Salida */}
                      <td className="py-3.5 px-6">
                        <input
                          type="time"
                          step="1800"
                          disabled={!item.active}
                          value={item.active ? item.endTime : ''}
                          onChange={(e) =>
                            handleTimeChange(
                              item.key,
                              'endTime',
                              e.target.value
                            )
                          }
                          className="border border-med-border rounded-lg px-3 py-1.5 text-xs bg-white text-med-text-main disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-med-primary-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mensajes de feedback y botones */}
        <div className="p-6 border-t border-med-border flex flex-col gap-3">
          {errorMessage && (
            <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-xs text-emerald-600 font-medium">
              {successMessage}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/doctors')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || loadingSchedule}>
              {isSubmitting ? 'Guardando...' : 'Guardar Disponibilidad'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default NewAvailabilityForm;
