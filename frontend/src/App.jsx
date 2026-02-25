import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Assignments from './pages/Assignments/Assignments';
import Attempt from './pages/AssignmentWorkspace/Attempt';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { ToastProvider } from './components/ToastContext';
import './styles/main.scss';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Assignments/>
              </ProtectedRoute>
            } />
            <Route path="/assignment/:id" element={
              <ProtectedRoute>
                <Attempt />
              </ProtectedRoute>
            } />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
