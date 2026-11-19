import { backInstance } from '../../../shared/api/axiosInstance';

export const createSpecialty = async (specialty) => {
  const response = await backInstance.post('api/specialties', specialty); //revisar esto
  return response.data;
};

export const SpecialtiesService = {
  createSpecialty,
};