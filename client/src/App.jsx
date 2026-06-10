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
import GoogleCallback from "./pages/auth/GoogleCallback";

const Dashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Welcome back, <span className="text-foreground font-medium">{user?.name || 'User'}</span>!
        </p>
      </div>

      <Button
        variant="outline"
        onClick={() => logout()}
        className="w-full max-w-[200px]"
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