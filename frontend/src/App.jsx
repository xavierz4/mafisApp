import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './features/dashboard/DashboardHome';
import AssetsList from './features/assets/AssetsList';
import AssetForm from './features/assets/AssetForm';
import ReportsList from './features/reports/ReportsList';
import ReportForm from './features/reports/ReportForm';
import useAuthStore from './features/auth/store';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore();
  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated);
  console.log('[ProtectedRoute] token:', token ? token.substring(0, 20) + '...' : 'null');
  
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] NOT authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          {/* Add other routes here later */}
          <Route path="assets" element={<AssetsList />} />
          <Route path="assets/new" element={<AssetForm />} />
          <Route path="assets/:id/edit" element={<AssetForm />} />
          <Route path="reports" element={<ReportsList />} />
          <Route path="reports/new" element={<ReportForm />} />
          <Route path="work-orders" element={<div>Órdenes (Próximamente)</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
