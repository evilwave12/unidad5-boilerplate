import axios from 'axios';

const backInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

backInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

backInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute =
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login';

      if (isAdminRoute) {
        localStorage.clear();
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    }

    return Promise.reject(error);
  }
);

export { backInstance };
