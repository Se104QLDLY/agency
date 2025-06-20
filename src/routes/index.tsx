import { Routes, Route, Outlet } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ImportPage from './import';
import AddImportPage from './import/add';
import ViewImportPage from './import/view';
import EditImportPage from './import/edit';
import ExportPage from './export';
import ExportDetailPage from './export/detail';
import AddExportPage from './export/add';
import EditExportPage from './export/edit';
import SearchPage from './search';
import PaymentPage from './payment';
import PaymentDetailPage from './payment/detail';
import AgencyPage from './agencies';
import AddAgencyPage from './agencies/add';
import ViewAgencyPage from './agencies/view';
import EditAgencyPage from './agencies/edit';
import DistributionRequestPage from './distribution';
import AddReportPage from './reports/add';
import ReportDetailPage from './reports/detail';
import ReportsIndexPage from './reports';
import NotFound from './NotFound';
import { DashboardLayout } from '../components/layout/DashboardLayout/DashboardLayout';

const MainLayout = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes (không có sidebar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Main layout with sidebar */}
      <Route path="/*" element={<MainLayout />}>
        <Route index element={<ExportPage />} />
        <Route path="export" element={<ExportPage />} />
        <Route path="export/detail/:id" element={<ExportDetailPage />} />
        <Route path="export/add" element={<AddExportPage />} />
        <Route path="export/edit/:id" element={<EditExportPage />} />

        <Route path="import" element={<ImportPage />} />
        <Route path="import/add" element={<AddImportPage />} />
        <Route path="import/view/:id" element={<ViewImportPage />} />
        <Route path="import/edit/:id" element={<EditImportPage />} />

        <Route path="agencies" element={<AgencyPage />} />
        <Route path="agencies/add" element={<AddAgencyPage />} />
        <Route path="agencies/view/:id" element={<ViewAgencyPage />} />
        <Route path="agencies/edit/:id" element={<EditAgencyPage />} />

        <Route path="search" element={<SearchPage />} />

        <Route path="payment" element={<PaymentPage />} />
        <Route path="payment/detail/:id" element={<PaymentDetailPage />} />

        <Route path="distribution" element={<DistributionRequestPage />} />

        <Route path="reports" element={<ReportsIndexPage />} />
        <Route path="reports/add" element={<AddReportPage />} />
        <Route path="reports/detail/:id" element={<ReportDetailPage />} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;