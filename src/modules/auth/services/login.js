import { backInstance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  const response = await backInstance.post('api/auth/login', {
    username,
    password,
  });

  return { data: response.data.token, error: null };
};
