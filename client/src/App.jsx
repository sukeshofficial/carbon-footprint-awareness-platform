import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CarbonContextProvider } from "./store/carbonContextStore";
import { CarbonEstimationProvider } from "./store/carbonEstimationStore";
import { ProfileProvider } from "./store/profileStore";
import { WhatIfProvider } from "./store/whatIfStore";
import { Toaster } from "./components/ui/sonner";
import { UnderDevelopmentBadge } from "./components/ui/underDevelopmentBadge/under-development-badge";
import { FeedbackSheet } from "./components/ui/feedbackSheet/feedback-sheet";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { ThemeProvider } from "next-themes";
import { useThemeShortcut } from "./hooks/useThemeShortcut";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import GoogleCallback from "./pages/auth/GoogleCallback";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import PlannerPage from "./pages/PlannerPage";

// Layout
import Navbar from "./components/layout/Navbar";
import OnboardingRedirect from "./components/layout/OnboardingRedirect";

// ─── ThemeShortcut (tiny helper — not worth its own file) ────────────────────
const ThemeShortcut = () => {
  useThemeShortcut();
  return null;
};

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <ThemeShortcut />
        <AuthProvider>
          <CarbonContextProvider>
            <ProfileProvider>
              <CarbonEstimationProvider>
                <WhatIfProvider>
                  <div className="min-h-screen bg-background font-sans antialiased text-foreground">
                    <Navbar />
                    <UnderDevelopmentBadge />
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                      <Route path="/auth/callback" element={<GoogleCallback />} />

                      {/* Protected Routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route element={<OnboardingRedirect />}>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/dashboard" element={<Navigate to="/" replace />} />
                          <Route path="/profile/edit" element={<EditProfile />} />
                          <Route path="/planner" element={<PlannerPage />} />
                        </Route>
                      </Route>

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>

                    <FeedbackSheet />
                    <Toaster
                      position="bottom-right"
                      closeButton
                      richColors={false}
                      toastOptions={{
                        classNames: {
                          toast: "rounded-xl border border-border bg-background/80 backdrop-blur-md",
                          title: "!text-foreground font-semibold",
                          description: "!text-muted-foreground !opacity-100",
                        },
                      }}
                    />
                  </div>
                </WhatIfProvider>
              </CarbonEstimationProvider>
            </ProfileProvider>
          </CarbonContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;