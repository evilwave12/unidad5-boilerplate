import { backInstance } from '../../../shared/api/axiosInstance';

export const getAvailabilitySlots = async (doctor) => {
  const { data } = await backInstance.get(
    `/api/doctors/${doctorId}/availabilities`
  );
  return Array.isArray(data) ? data : data.data || [];
};
