import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { GoalProvider } from './contexts/GoalContext';
import { EventProvider } from './contexts/EventContext';
import { FinanceProvider } from './contexts/FinanceContext';
import { CourseProvider } from './contexts/CourseContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { Layout } from './components/common/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Goals } from './pages/Goals';
import { CalendarPage } from './pages/Calendar';
import { Finances } from './pages/Finances';
import { Courses } from './pages/Courses';
import { Settings } from './pages/Settings';
import { Subscription } from './pages/Subscription';

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Carregando sua conta..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente principal da aplicação
const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <Tasks />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Layout>
              <Goals />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Layout>
              <CalendarPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/finances"
        element={
          <ProtectedRoute>
            <Layout>
              <Finances />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Layout>
              <Courses />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Layout>
              <Subscription />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <GoalProvider>
          <EventProvider>
            <FinanceProvider>
                      <CourseProvider>
          <SettingsProvider>
            <SubscriptionProvider>
              <AppContent />
            </SubscriptionProvider>
          </SettingsProvider>
        </CourseProvider>
      </FinanceProvider>
    </EventProvider>
  </GoalProvider>
</TaskProvider>
    </AuthProvider>
  );
}

export default App;
