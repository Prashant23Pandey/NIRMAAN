import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Shells
import { WorkerShell } from './shells/WorkerShell';
import { HomeownerShell } from './shells/HomeownerShell';
import { ContractorShell } from './shells/ContractorShell';
import { AdminShell } from './shells/AdminShell';

// Global Common Modals & Helpers
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { SosModal } from './components/common/SosModal';
import { QrModal } from './components/common/QrModal';
import { Toast } from './components/common/Toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public & Onboarding Pages
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { SplashRolePage } from './pages/SplashRolePage';
import { LoginPage } from './pages/LoginPage';
import { WorkerProfileSetupPage } from './pages/WorkerProfileSetupPage';
import { WorkerRegistrationPage } from './pages/worker/WorkerRegistrationPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { useApp } from './context/AppContext';
import { api } from './services/api';

// Worker Pages
import { WorkerHomePage } from './pages/WorkerHomePage';
import { ProfessionDashboardPage } from './pages/worker/ProfessionDashboardPage';
import { WorkerJobsPage } from './pages/WorkerJobsPage';
import { WorkerJobDetailPage } from './pages/WorkerJobDetailPage';
import { WorkerPassportPage } from './pages/WorkerPassportPage';
import { WorkerHistoryPage } from './pages/WorkerHistoryPage';
import { WorkerWorkPage } from './pages/WorkerWorkPage';
import { WorkerEarningsPage } from './pages/WorkerEarningsPage';

// Homeowner Pages
import { HomeownerHomePage } from './pages/HomeownerHomePage';
import { HomeownerCreateProjectPage } from './pages/HomeownerCreateProjectPage';
import { HomeownerAiAssistantPage } from './pages/HomeownerAiAssistantPage';
import { HomeownerWorkersPage } from './pages/HomeownerWorkersPage';
import { HomeownerWorkerDetailPage } from './pages/HomeownerWorkerDetailPage';
import { HomeownerComparePage } from './pages/HomeownerComparePage';
import { HomeownerProjectDashboardPage } from './pages/HomeownerProjectDashboardPage';
import { HomeownerTimelinePage } from './pages/HomeownerTimelinePage';
import { HomeownerPaymentPage } from './pages/HomeownerPaymentPage';

// Contractor Pages
import { ContractorDashboardPage } from './pages/contractor/ContractorDashboardPage';
import { ContractorProjectsPage } from './pages/contractor/ContractorProjectsPage';
import { ContractorTeamPage } from './pages/contractor/ContractorTeamPage';
import { ContractorJobsPage } from './pages/contractor/ContractorJobsPage';
import { ContractorAttendancePage } from './pages/contractor/ContractorAttendancePage';
import { ContractorPaymentsPage } from './pages/contractor/ContractorPaymentsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminProfessionsPage } from './pages/admin/AdminProfessionsPage';
import { AdminSkillsPage } from './pages/admin/AdminSkillsPage';
import { AdminVerificationPage } from './pages/admin/AdminVerificationPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminDisputesPage } from './pages/admin/AdminDisputesPage';
import { AdminEmergencyPage } from './pages/admin/AdminEmergencyPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminDatabasePage } from './pages/admin/AdminDatabasePage';
import { AdminLogsPage } from './pages/admin/AdminLogsPage';

// Trust & Impact Pages
import { TrustCentrePage } from './pages/TrustCentrePage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LogoutHandler() {
  const { setRole, showToast } = useApp();
  useEffect(() => {
    localStorage.removeItem('nirmaan_auth_token');
    localStorage.removeItem('nirmaan_user');
    api.setToken(null);
    setRole('guest' as any);
    showToast('Logged out successfully', 'info');
    window.location.href = '/login';
  }, [setRole, showToast]);
  return null;
}

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17211F] font-sans selection:bg-[#176B5B] selection:text-white">
      <ScrollToTop />

      {/* Global Modals */}
      <NotificationDrawer />
      <SosModal />
      <QrModal />
      <Toast />

      {/* Routes */}
      <Routes>
        {/* Public & Authentication */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/splash" element={<SplashRolePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutHandler />} />
        <Route path="/worker/setup" element={<WorkerProfileSetupPage />} />
        <Route path="/worker/register" element={<WorkerRegistrationPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 1. Worker Shell & Routes */}
        <Route path="/worker" element={<ProtectedRoute allowedRole="worker"><WorkerShell /></ProtectedRoute>}>
          <Route index element={<WorkerHomePage />} />
          <Route path="home" element={<WorkerHomePage />} />
          <Route path="jobs" element={<WorkerJobsPage />} />
          <Route path="jobs/:id" element={<WorkerJobDetailPage />} />
          <Route path="passport" element={<WorkerPassportPage />} />
          <Route path="history" element={<WorkerHistoryPage />} />
          <Route path="work" element={<WorkerWorkPage />} />
          <Route path="earnings" element={<WorkerEarningsPage />} />
          {/* Individual Profession Dashboards */}
          <Route path="mason" element={<ProfessionDashboardPage />} />
          <Route path="electrician" element={<ProfessionDashboardPage />} />
          <Route path="plumber" element={<ProfessionDashboardPage />} />
          <Route path="carpenter" element={<ProfessionDashboardPage />} />
          <Route path="painter" element={<ProfessionDashboardPage />} />
          <Route path="tile-worker" element={<ProfessionDashboardPage />} />
          <Route path="welder" element={<ProfessionDashboardPage />} />
          <Route path="hvac" element={<ProfessionDashboardPage />} />
          <Route path="roofer" element={<ProfessionDashboardPage />} />
          <Route path="flooring" element={<ProfessionDashboardPage />} />
          <Route path="helper" element={<ProfessionDashboardPage />} />
          <Route path=":profession" element={<ProfessionDashboardPage />} />
        </Route>

        {/* 2. Homeowner Shell & Routes */}
        <Route path="/homeowner" element={<ProtectedRoute allowedRole="homeowner"><HomeownerShell /></ProtectedRoute>}>
          <Route index element={<HomeownerHomePage />} />
          <Route path="home" element={<HomeownerHomePage />} />
          <Route path="project/new" element={<HomeownerCreateProjectPage />} />
          <Route path="ai-assistant" element={<HomeownerAiAssistantPage />} />
          <Route path="workers" element={<HomeownerWorkersPage />} />
          <Route path="workers/:id" element={<HomeownerWorkerDetailPage />} />
          <Route path="compare" element={<HomeownerComparePage />} />
          <Route path="project/:id" element={<HomeownerProjectDashboardPage />} />
          <Route path="project/:id/timeline" element={<HomeownerTimelinePage />} />
          <Route path="project/:id/payment" element={<HomeownerPaymentPage />} />
        </Route>

        {/* 3. Contractor Shell & Routes */}
        <Route path="/contractor" element={<ProtectedRoute allowedRole="contractor"><ContractorShell /></ProtectedRoute>}>
          <Route index element={<ContractorDashboardPage />} />
          <Route path="dashboard" element={<ContractorDashboardPage />} />
          <Route path="projects" element={<ContractorProjectsPage />} />
          <Route path="team" element={<ContractorTeamPage />} />
          <Route path="jobs" element={<ContractorJobsPage />} />
          <Route path="attendance" element={<ContractorAttendancePage />} />
          <Route path="payments" element={<ContractorPaymentsPage />} />
        </Route>

        {/* 4. Super Admin Shell & Control Centre */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="SUPER_ADMIN"><AdminShell /></ProtectedRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="workers" element={<AdminUsersPage />} />
          <Route path="homeowners" element={<AdminUsersPage />} />
          <Route path="contractors" element={<AdminUsersPage />} />
          <Route path="professions" element={<AdminProfessionsPage />} />
          <Route path="skills" element={<AdminSkillsPage />} />
          <Route path="verification" element={<AdminVerificationPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="disputes" element={<AdminDisputesPage />} />
          <Route path="emergency" element={<AdminEmergencyPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="database" element={<AdminDatabasePage />} />
          <Route path="logs" element={<AdminLogsPage />} />
          <Route path="settings" element={<AdminDashboardPage />} />
        </Route>

        {/* Trust & Impact Showcase (Public & Accessible) */}
        <Route path="/trust" element={<TrustCentrePage />} />
        <Route path="/impact" element={<ImpactDashboardPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </div>
  );
};

export default App;
