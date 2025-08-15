import { createContext, useContext, useMemo, useState } from 'react';
import api from '../axiosConfig';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem('token') || localStorage.getItem('authToken') || ''
  );

  const value = useMemo(() => ({
    token,
    isAuthed: !!token,
    async login(email, password) {
      const { data } = await api.post('/api/users/login', { email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
    },
    async register(name, email, password) {
      const { data } = await api.post('/api/users/register', { name, email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
    },
    logout() {
      localStorage.removeItem('token');
      setToken('');
    }
  }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
