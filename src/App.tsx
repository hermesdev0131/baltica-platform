import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { NotificationProvider } from "./contexts/NotificationContext";

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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main app routes */}
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* Journey */}
              <Route path="/journey/:day" element={<JourneyPage />} />

              {/* Progress & Achievements */}
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />

              {/* Settings & Account */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/activity-log" element={<ActivityLogPage />} />

              {/* Payment */}
              <Route path="/payment" element={<PaymentPage />} />

              {/* Info pages */}
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/help" element={<HelpPage />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
