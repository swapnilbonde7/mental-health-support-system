import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import ResourceList from './features/resources/ResourceList';
import ResourceEdit from './features/resources/ResourceEdit';
import ResourceCreate from './features/resources/ResourceCreate';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/resources" replace />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/resources/new" element={<ResourceCreate />} />
          <Route path="/resources/:id/edit" element={<ResourceEdit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/resources" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
