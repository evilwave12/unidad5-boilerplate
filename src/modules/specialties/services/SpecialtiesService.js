import { backInstance } from '../../shared/api/axiosInstance';

export const getSpecialties = async (pageSize, pageIndex, name='') => {
  const params = {pageSize, pageIndex};
  if(name.trim().length >= 3){
    params.name = name.trim();
  }
  const response = await backInstance.get('api/specialties',{ params });
  return response.data;
};

export const createSpecialty = async (specialty) => {
  const response = await backInstance.post('api/specialties', specialty); //revisar esto
  return response.data;
};

export const deleteSpecialty = async(id) => {
  await backInstance.delete('api/specialties/'+id)
}

export const getAllSpecialties = async () => {
  const { data } = await backInstance.get('/api/specialties');
  // Soporta tanto respuesta paginada { data: [...], total } como array directo
  return Array.isArray(data) ? data : data.data || [];
};

export const getSpecialtiesWithDoctors = async () => {
  const {data} = await backInstance.get('api/specialties/withDoctors');
  const list = Array.isArray(data) ? data : data.data ?? data.items ?? [];

  return list.map((spec) => ({
    ...spec,
    doctors: Array.isArray(spec.doctors) ? spec.doctors : [],
  }))
};

export const SpecialtiesService = {
  getSpecialties,
  createSpecialty,
  deleteSpecialty,
  getAllSpecialties,
  getSpecialtiesWithDoctors,
};

