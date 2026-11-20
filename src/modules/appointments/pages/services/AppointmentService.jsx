import { backInstance } from '../../../shared/api/axiosInstance';

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

export const AppointmentService = {
  getSpecialties,
  getDoctors,
  getAppointmentsBySearch,
};

export default AppointmentService;
