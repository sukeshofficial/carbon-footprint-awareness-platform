import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { UnderDevelopmentBadge } from "./components/ui/underDevelopmentBadge/under-development-badge";
import { FeedbackSheet } from "./components/ui/feedbackSheet/feedback-sheet";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Button } from "./components/ui/button";
import { useAuth } from "./contexts/AuthContext";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import GoogleCallback from "./pages/auth/GoogleCallback";

import CurrentDevelopmentCard from "./components/ui/CurrentDevelopmentCard";

const Dashboard = () => {
  const { logout, user } = useAuth();

  const devData = {
    title: "🚧 In Development",
    description: "Building a profile system to personalize carbon insights, benchmarks, coaching tone, and recommendations based on user lifestyle and preferences.",
    phase: "Phase 1 / 6",
    status: "Active Development",
    nextMilestone: "Profile API + Setup UI",
    updatedAt: "2 hours ago",
    checklist: [
      { label: "Identity details (display name, city/region)", completed: true },
      { label: "User type selection", completed: false },
      { label: "Household type setup", completed: false },
      { label: "Tone preference setup", completed: false },
      { label: "Profile editing support", completed: false },
      { label: "Personalized carbon recommendations", completed: false },
    ]
  };

  return (
    <div className="flex flex-col items-center min-h-[100dvh] lg:h-screen px-4 py-8 sm:px-6 lg:justify-center gap-6 lg:overflow-hidden">
      <div className="text-center space-y-1 w-full max-w-lg">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 leading-tight">Dashboard</h1>
        <p className="text-muted-foreground text-base">
          Welcome back, <span className="text-foreground font-medium">{user?.name || 'User'}</span>!
        </p>
      </div>

      <CurrentDevelopmentCard {...devData} />

      <Button
        variant="outline"
        onClick={() => logout()}
        className="w-full max-w-[180px] rounded-full h-10 font-bold"
      >
        Sign Out
      </Button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
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
      </AuthProvider>
    </Router>
  );
}

export default App;