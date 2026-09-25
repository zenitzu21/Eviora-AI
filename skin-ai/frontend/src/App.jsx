import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import BodyMap from './pages/BodyMap';
import NewScan from './pages/NewScan';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import UploadReport from './pages/UploadReport';
import DownloadReport from './pages/DownloadReport';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-scan" element={<NewScan />} />
          <Route path="/body-map" element={<BodyMap />} />
          <Route path="/reports" element={<UploadReport />} />
          <Route path="/downloads" element={<DownloadReport />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/new-scan" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
