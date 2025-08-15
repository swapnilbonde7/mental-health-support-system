import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResourceList from './features/resources/ResourceList';

function App() {
  return (
    <Router>
      <Routes>
        {/* Resources page */}
        <Route path="/resources" element={<ResourceList />} />

        {/* Redirect anything else (including "/") to /resources */}
        <Route path="*" element={<Navigate to="/resources" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
