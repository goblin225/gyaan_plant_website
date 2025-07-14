import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from '../pages/auth/LoginPage';
import { BrowsePage } from '../pages/BrowsePage';
import { CoursePage } from '../pages/CoursePage';
import { DashboardPage } from '../pages/DashboardPage';
import { HomePage } from '../pages/HomePage';
import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../store/themeStore';
import { Header } from '../components/layout/Header';
import Profile from '../pages/profile/Profile';
import { ResumeWalkthrough } from '../pages/resume/ResumeWalkthrough';
import { ResumeDashboard } from '../pages/resume/ResumeDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { theme } = useThemeStore();
  const location = useLocation();

  const hideHeaderRoutes = ['/resume'];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background text-foreground">
        {!shouldHideHeader && <Header />}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/resume" element={<ResumeWalkthrough />} />
            <Route path="/resumedashboard" element={<ResumeDashboard />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-learning" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#1f2937' : '#ffffff',
              color: theme === 'dark' ? '#f9fafb' : '#111827',
              border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
            },
          }}
        />
      </div>
    </div>
  );
}

export default AppRoutes;