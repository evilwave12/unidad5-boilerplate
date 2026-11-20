import { backInstance } from '../../../shared/api/axiosInstance';

export const createDoctor = async (doctor) => {
  const response = await backInstance.post('api/doctors', doctor);
  return response.data;
};

export const getAllDoctors = async () => {
  const { data } = await backInstance.get('/api/doctors');
  // Soporta tanto respuesta paginada { data: [...], total } como array directo
  return Array.isArray(data) ? data : data.data || [];
};

export const getDoctors = async (pageSize, pageIndex, name='') => {
  const params = {pageSize, pageIndex};
  if(name.trim().length >= 3){
    params.name = name.trim();
  }
  const response = await backInstance.get('api/doctors',{ params });
  return response.data;
};

export const getDoctorAvailabilities = async (doctorId) => {
  const { data } = await backInstance.get(`/api/doctors/${doctorId}/availabilities`);
  return Array.isArray(data) ? data : data.data || [];
};

export const saveDoctorAvailabilities = async (payload, isUpdate) => {
  if (isUpdate) {
    const { data } = await backInstance.put('/api/availabilities', payload);
    return data;
  }
  const { data } = await backInstance.post('/api/availabilities', payload);
  return data;
};

export const deleteDoctor = async(id) => {
  await backInstance.delete('api/doctors/'+id)
}

export const DoctorsService = {
  createDoctor,
  getAllDoctors,
  getDoctors,
  getDoctorAvailabilities,
  saveDoctorAvailabilities,
  deleteDoctor,
};