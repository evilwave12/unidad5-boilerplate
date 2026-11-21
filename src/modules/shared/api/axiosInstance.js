import axios from 'axios';

const backInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

const isTokenExpired = (token) => { //esto es de ia
  if (!token || token.startsWith('mock-')) return false;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const { exp } = JSON.parse(atob(padded));
    return typeof exp === 'number' && exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const clearAndRedirect = () => { //se usa mas abajo cuando se larga un error 401
  const { pathname } = window.location;
  if (pathname.startsWith('/admin')) {
    localStorage.clear();
    if (pathname !== '/admin/login') window.location.href = '/admin/login';
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    if (pathname !== '/login') window.location.href = '/login';
  }
};

backInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const isLogin = config.url?.includes('/login'); //no se q hace esto

    if (!isLogin && token) {
      if (isTokenExpired(token)) {
        clearAndRedirect();
        return Promise.reject(new Error('Token expirado'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

backInstance.interceptors.response.use(
  (config) => config,
  (error) => {
    if (error.response?.status === 401) {
      clearAndRedirect();
    }

    return Promise.reject(error);
  }
);

export { backInstance };
