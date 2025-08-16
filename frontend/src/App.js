import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';

import TopNav from './components/TopNav';
import PrivateRoute from './components/PrivateRoute';

// Resources
import ResourceList from './features/resources/ResourceList';
import ResourceCreate from './features/resources/ResourceCreate';
import ResourceEdit from './features/resources/ResourceEdit';

// Tasks
import TaskList from './features/tasks/TaskList';
import TaskForm from './features/tasks/TaskForm';
import TaskEdit from './features/tasks/TaskEdit';

// Auth
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <TopNav />
        <Routes>
          <Route path="/" element={<Navigate to="/resources" replace />} />

          {/* Protected */}
          <Route path="/resources" element={<PrivateRoute><ResourceList /></PrivateRoute>} />
          <Route path="/resources/new" element={<PrivateRoute><ResourceCreate /></PrivateRoute>} />
          <Route path="/resources/:id/edit" element={<PrivateRoute><ResourceEdit /></PrivateRoute>} />

          <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
          <Route path="/tasks/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
          <Route path="/tasks/:id/edit" element={<PrivateRoute><TaskEdit /></PrivateRoute>} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<Navigate to="/resources" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
