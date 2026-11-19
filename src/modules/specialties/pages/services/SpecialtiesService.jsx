import { backInstance } from '../../../shared/api/axiosInstance';

export const getSpecialties = async (pageSize = 10, pageIndex = 1, name='') => {
  const params = {pageSize, pageIndex};
  if(name.trim().length()<=3){
    params.name = name.trim();
  }
  const response = await backInstance.get('api/specialties',{ params });
  return response.data;
};

export const createSpecialty = async (specialty) => {
  const response = await backInstance.post('api/specialties', specialty); //revisar esto
  return response.data;
};

export const SpecialtiesService = {
  getSpecialties,
  createSpecialty,
};