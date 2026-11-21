import { backInstance } from '../../shared/api/axiosInstance';

export const getAppointmentsBySearch = async ({
  dni,
  specialtyId,
  doctorId,
  date,
  pageIndex = 1,
  pageSize = 10,
} = {}) => {
  const params = { pageIndex, pageSize };

  if (dni?.trim()) params.dni = dni.trim();
  if (specialtyId) params.specialtyId = specialtyId;
  if (doctorId) params.doctorId = doctorId;
  if (date) params.date = date;

  const { data } = await backInstance.get('/api/appointments/search', {
    params,
  });

  const items = data.items ?? data.data ?? (Array.isArray(data) ? data : []);
  const totalCount =
    data.totalCount ?? data.totalItems ?? data.totalRecords ?? items.length;

  return { items, totalCount };
};

export const getSpecialties = async () => {
  const { data } = await backInstance.get('/api/specialties');
  return Array.isArray(data) ? data : (data.items ?? data.data ?? []);
};

export const getDoctors = async () => {
  const { data } = await backInstance.get('/api/doctors');
  return Array.isArray(data) ? data : (data.items ?? data.data ?? []);
};

export const createAppointment = async (appointmentPayload) => {
  const { data } = await backInstance.post(
    '/api/appointments',
    appointmentPayload
  );
  return data;
};

export const getPatientAppointments = async (dni) => {
  const { data } = await backInstance.get('/api/appointments/patient', {
    params: { dni },
  });
  return Array.isArray(data) ? data : (data.items ?? data.data ?? []);
};

export const cancelAppointment = async (appointmentId) => {
  const { data } = await backInstance.delete(
    `/api/appointments/${appointmentId}`
  );
  return data;
};

export const AppointmentService = {
  getSpecialties,
  getDoctors,
  getAppointmentsBySearch,
  createAppointment,
  getPatientAppointments,
  cancelAppointment,
};

export default AppointmentService;