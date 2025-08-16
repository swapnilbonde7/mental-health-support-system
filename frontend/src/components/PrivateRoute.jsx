import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthed, loading } = useAuth();
  if (loading) return null; // or a loader
  return isAuthed ? children : <Navigate to="/login" replace />;
}
