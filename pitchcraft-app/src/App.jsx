
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard'; 
import CreatePitch from './pages/CreatePitch'; 
import GeneratedPitch from './pages/GeneratedPitch'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} /> 

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePitch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pitch/:id"
          element={
            <ProtectedRoute>
              <GeneratedPitch />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;