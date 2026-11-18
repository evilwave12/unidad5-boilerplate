import { backInstance } from '../../shared/api/axiosInstance';

export const loginAdmin = async (email, password) => {
  try {
    const { data } = await backInstance.post('/api/auth/admin/login', {
      email,
      password,
    });
    
    // Suponiendo que el backend retorna { token, role } o directamente el token string
    const token = data.token || data;
    return { data: token, error: null };
  } catch (err) {
    return {
      data: null,
      error: err.response?.data?.message || 'Credenciales inválidas o error en el servidor.',
    };
  }
};

/*export const loginAdmin = async (username, password) => {
  if (
    (username === 'admin' ||
      username === 'admin@medportal.com' ||
      username === 'admin@test.com') &&
    password === 'admin123'
  ) {
    return { data: 'mock-admin-token-12345', error: null };
  }

  const response = await { backInstance }.post('api/admin/auth/login', {
    username,
    password,
  });

  return { data: response.data.token, error: null };
};*/
