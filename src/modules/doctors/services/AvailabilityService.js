import { backInstance } from '../../shared/api/axiosInstance';

export const getAvailabilitySlots = async (doctor) => {
  const { data } = await backInstance.get(
    `/api/doctors/${doctor}/availabilities`
  );
  return Array.isArray(data) ? data : data.data || [];
};
