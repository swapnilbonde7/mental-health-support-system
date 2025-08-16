import { createContext, useContext, useEffect, useState } from 'react';
import api from '../axiosConfig';

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On load, hydrate from token
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setUser(null); return; }
        const { data } = await api.get('/api/users/me');
        setUser(data);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    if (!data?.token) throw new Error('No token');
    localStorage.setItem('token', data.token);
    const me = await api.get('/api/users/me');
    setUser(me.data);
    return true;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    if (!data?.token) throw new Error('No token');
    localStorage.setItem('token', data.token);
    setUser(data.user || null);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, isAuthed: !!user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
