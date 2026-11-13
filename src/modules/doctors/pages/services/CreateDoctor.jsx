import { instance } from '../../../shared/api/axiosInstance';

export const createDoctor = async (doctor) => {
  const response = await instance.post('api/doctors', doctor);
  return response.data;
};