import { instance } from '../../../shared/api/axiosInstance';

export const getDoctors = async () => {
  const { data } = await instance.get('/api/doctors');
  // Soporta tanto respuesta paginada { data: [...], total } como array directo
  return Array.isArray(data) ? data : data.data || [];
};

export const getDoctorAvailabilities = async (doctorId) => {
  const { data } = await instance.get(`/api/doctors/${doctorId}/availabilities`);
  return Array.isArray(data) ? data : data.data || [];
};

export const saveDoctorAvailabilities = async (payload, isUpdate) => {
  if (isUpdate) {
    const { data } = await instance.put('/api/availabilities', payload);
    return data;
  }
  const { data } = await instance.post('/api/availabilities', payload);
  return data;
};