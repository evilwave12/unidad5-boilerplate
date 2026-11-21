import { backInstance } from '../../shared/api/axiosInstance';

// Disponibilidades del doctor
export const getDoctorAvailabilities = async (doctorId) => {
  const { data } = await backInstance.get(
    `/api/doctors/${doctorId}/availabilities`
  );
  return Array.isArray(data) ? data : (data.items ?? data.data ?? []);
};

// Slots disponibles para un availabilityId puntual
export const getAvailabilitySlots = async (availabilityId) => {
  const { data } = await backInstance.get(
    `/api/availabilities/${availabilityId}/availabilitySlots`
  );
  return Array.isArray(data) ? data : (data.items ?? data.data ?? []);
};

// Combina disponibilidades y sus slots sin que un 404 puntual rompa toda la carga
export const getSlotsByDoctor = async (doctorId) => {
  const availabilities = await getDoctorAvailabilities(doctorId);
  const activeAvailabilities = availabilities.filter(
    (av) => av.isActive !== false
  );

  if (!activeAvailabilities.length) return [];

  const results = await Promise.allSettled(
    activeAvailabilities.map(async (av) => {
      const slots = await getAvailabilitySlots(av.id);
      return slots.map((slot) => ({
        ...slot,
        _availability: av,
      }));
    })
  );

  return results
    .filter((res) => res.status === 'fulfilled')
    .flatMap((res) => res.value);
};

export const AvailabilityService = {
  getDoctorAvailabilities,
  getAvailabilitySlots,
  getSlotsByDoctor,
};

export default AvailabilityService;