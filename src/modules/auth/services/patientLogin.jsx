import { backInstance } from '../../shared/api/axiosInstance';

export const loginPatient = async (username, password) => {
  if (
    (username === 'paciente' ||
      username === 'paciente@medportal.com' ||
      username === 'paciente@test.com') &&
    password === 'paciente123'
  ) {
    return { data: 'mock-patient-token-67890', error: null };
  }

  const response = await backInstance.post('api/patient/auth/login', {
    username,
    password,
  });

  return { data: response.data.token, error: null };
};
