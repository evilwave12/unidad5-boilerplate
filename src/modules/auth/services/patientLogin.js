import { backInstance } from '../../shared/api/axiosInstance';

export const loginPatient = async (email, dni) => {
  /*if (
    (email === 'paciente' ||
      email === 'paciente@medportal.com' ||
      email === 'paciente@test.com') &&
    String(dni) === 'paciente123'
  ) {
    return { data: { token: 'mock-patient-token-67890', role: 'Paciente' }, error: null };
  }*/

  /*const response = await backInstance.post('api/patient/auth/login', {
    username,
    password,
  });
  return { data: response.data.token, error: null };*/

  try {
    const { data } = await backInstance.post('/api/auth/patient/login', {
      email,
      dni:Number(dni),
    });
    
    return { data: { token: data.token, role: data.role }, error: null };
  } catch (err) {
    return {
      data: null,
      error: err.response?.data?.message || 'Credenciales inválidas o error en el servidor.',
    };
  }
};
