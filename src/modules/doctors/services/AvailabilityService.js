import { backInstance } from '../../shared/api/axiosInstance';

//disponibilidades del doc
export const getDoctorAvailabilities = async (doctorId) => {
  const { data } = await backInstance.get(
    `/api/doctors/${doctorId}/availabilities`
  );
  return Array.isArray(data) ? data : (data.items ?? data.data ?? []);
};

//slots disponibles para un availabilityId puntual
export const getAvailabilitySlots = async (availabilityId) => {
  const { data } = await backInstance.get(
    `/api/availabilities/${availabilityId}/availabilitySlots`
  );
  return Array.isArray(data) ? data : (data.items ?? data.data ?? []);
};

//mezcla los dos de arriba jiji
export const getSlotsByDoctor = async (doctorId) => {
  const availabilities = await getDoctorAvailabilities(doctorId);

  if (!availabilities.length) return [];

  const slotsArrays = await Promise.all(
    availabilities.map((av) => getAvailabilitySlots(av.id))
  );

  return slotsArrays.flat();
};

export const AvailabilityService = {
  getDoctorAvailabilities,
  getAvailabilitySlots,
  getSlotsByDoctor,
};

export default AvailabilityService;
