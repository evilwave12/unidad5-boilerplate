import { createContext, useState } from 'react';
//import { login } from '../services/login';
import { loginAdmin } from '../services/adminLogin';
import { loginPatient } from '../services/patientLogin';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const [role, setRole] = useState(() => localStorage.getItem('role'));

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
  };

  const setAuthSession = (token, userRole) => {
    const normalizedRole = userRole?.toLowerCase() ?? null; //REVISAR
    localStorage.setItem('token', token);
    if (normalizedRole) {
      localStorage.setItem('role', normalizedRole);
    } else {
      localStorage.removeItem('role');
    }
    setIsAuthenticated(true);
    setRole(normalizedRole);
  };

  /*const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    setAuthSession(data);
    return { error: null };
  };*/

  const singinAdmin = async (email, password) => {
    if ( //con esto nos logueamos cuando el back no está encendido
      (email === 'admin' ||
        email === 'admin@medportal.com' ||
        email === 'admin@test.com') &&
      password === 'admin123'
    ) {
      setAuthSession('mock-admin-token-12345', 'Administrador');

      return { error: null };
    }

    const { data, error } = await loginAdmin(email, password);

    if (error) { return { error }; }

    setAuthSession(data.token, data.role || 'Administrador');

    return { error: null };
  };

  const singinPatient = async (username, password) => {
    if (
      (username === 'paciente' ||
        username === 'paciente@medportal.com' ||
        username === 'paciente@test.com') &&
      password === 'paciente123'
    ) {
      setAuthSession('mock-patient-token-67890', 'Paciente');

      return { error: null };
    }

    const { data, error } = await loginPatient(username, password);

    if (error) { return { error }; }

    setAuthSession(data.token, data.role || 'Paciente');

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        //singin,
        singinAdmin,
        singinPatient,
        singout,
        setAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
