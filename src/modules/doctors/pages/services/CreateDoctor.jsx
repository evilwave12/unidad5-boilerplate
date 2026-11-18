import { backInstance } from '../../../shared/api/axiosInstance';

export const createDoctor = async (doctor) => {
  const response = await backInstance.post('api/doctors', doctor);
  return response.data;
};