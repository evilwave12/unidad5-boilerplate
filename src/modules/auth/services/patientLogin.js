import { backInstance } from '../../shared/api/axiosInstance';

export const loginPatient = async (email, password) => {
  if (
    (email === 'paciente' ||
      email === 'paciente@medportal.com' ||
      email === 'paciente@test.com') &&
    password === 'paciente123'
  ) {
    return { data: { token: 'mock-patient-token-67890', role: 'user' }, error: null };
  }

  /*const response = await backInstance.post('api/patient/auth/login', {
    username,
    password,
  });
  return { data: response.data.token, error: null };*/

  try {
    const { data } = await backInstance.post('/api/auth/patient/login', {
      email,
      password,
    });
    
    return { data: { token: data.token, role: data.role }, error: null };
  } catch (err) {
    return {
      data: null,
      error: err.response?.data?.message || 'Credenciales inválidas o error en el servidor.',
    };
  }
};
