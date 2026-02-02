import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import { AdminProvider, useAdmin } from "./contexts/AdminContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AccessBlocked } from "./components/AccessBlocked";

// Pages
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import JourneyPage from "./pages/JourneyPage";
import ProgressPage from "./pages/ProgressPage";
import AchievementsPage from "./pages/AchievementsPage";
import SettingsPage from "./pages/SettingsPage";
import ActivityLogPage from "./pages/ActivityLogPage";
import PaymentPage from "./pages/PaymentPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import HelpPage from "./pages/HelpPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper - redirects to /landing if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userEmail, onboardingCompleted, paymentCompleted } = useApp();
  const { getUserStatus, isAdmin } = useAdmin();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  // Admin should only see admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Payment gate: after onboarding, before Day 1
  // Allow /onboarding and /payment through without payment check
  const paymentExemptPaths = ['/onboarding', '/payment'];
  if (onboardingCompleted && !paymentCompleted && !paymentExemptPaths.includes(location.pathname)) {
    return <Navigate to="/payment" replace />;
  }

  // Check access status for non-admin users (exempt /payment so unpaid users can pay)
  const userStatus = getUserStatus(userEmail);
  if (userStatus && location.pathname !== '/payment') {
    if (userStatus.status === 'suspended') {
      return <AccessBlocked reason="suspended" />;
    }
    if (userStatus.status === 'expired') {
      return <AccessBlocked reason="expired" />;
    }
  }

  return <>{children}</>;
}

// Public Route wrapper - redirects to / if already authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  const { isAdmin } = useAdmin();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }

  return <>{children}</>;
}

// Admin Route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  const { isAdmin } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/landing" element={<LandingPage />} />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* Admin route */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journey/:day"
        element={
          <ProtectedRoute>
            <JourneyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <AchievementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity-log"
        element={
          <ProtectedRoute>
            <ActivityLogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      {/* Info pages - accessible to all */}
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/help" element={<HelpPage />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <AdminProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </AdminProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
