import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CarbonContextProvider } from "./store/carbonContextStore";
import { CarbonEstimationProvider } from "./store/carbonEstimationStore";
import { ProfileProvider, useProfile } from "./store/profileStore";
import { Toaster } from "./components/ui/sonner";
import { UnderDevelopmentBadge } from "./components/ui/underDevelopmentBadge/under-development-badge";
import { FeedbackSheet } from "./components/ui/feedbackSheet/feedback-sheet";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Button } from "./components/ui/button";
import { useAuth } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings, User as UserIcon, ChevronRight } from "lucide-react";

import { ThemeProvider } from "next-themes";
import { useThemeShortcut } from "./hooks/useThemeShortcut";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import GoogleCallback from "./pages/auth/GoogleCallback";

import EditProfile from "./pages/EditProfile";
import OnboardingModal from "./components/profile/OnboardingModal";
import CarbonContextOnboarding from "./components/onboarding/CarbonContextOnboarding";
import { useCarbonContext } from "./store/carbonContextStore";

// Components
import CarbonDashboardCard from "./components/carbon/CarbonDashboardCard";
import CurrentDevelopmentCard from "./components/ui/CurrentDevelopmentCard";

const Dashboard = () => {
  const { logout, user } = useAuth();
  const { profile } = useProfile();
  const { isComplete: isCarbonComplete } = useCarbonContext();

  const devData = {
    title: "🚧 In Development",
    description: "Building a profile system to personalize carbon insights, benchmarks, coaching tone, and recommendations based on user lifestyle and preferences.",
    phase: "Phase 1 / 7",
    status: "Active Development",
    nextMilestone: "Profile API + Setup UI",
    updatedAt: "2 hours ago",
    checklist: [
      { label: "Identity details (display name, city/region)", completed: true },
      { label: "User type selection", completed: true },
      { label: "Household setup", completed: true },
      { label: "Tone preference setup", completed: true },
      { label: "Profile Onboarding (8 steps)", completed: true },
      { label: "Carbon Context Onboarding (7 steps)", completed: true },
      { label: "Personalized carbon recommendations", completed: false },
    ]
  };

  const getNudgeText = (section) => {
    const nudges = {
      transportProfile: "Complete your transport profile for better commute insights",
      foodProfile: "Add diet details for accurate food footprint estimates",
      energyProfile: "Add energy habits for home carbon analysis",
      shoppingProfile: "Add shopping habits for consumption footprint",
      wasteProfile: "Add waste habits for accurate waste estimation"
    };
    return nudges[section];
  };

  return (
    <div className="flex flex-col items-center min-h-[100dvh] lg:min-h-screen px-4 py-8 sm:px-6 overflow-y-auto w-full">
      <div className="w-full max-w-[80vw] flex flex-col lg:flex-row gap-10 items-start justify-center lg:py-12">
        {/* Main Column */}
        <div className="flex-1 flex flex-col items-center lg:items-start space-y-8 w-full">
          <div className="text-center lg:text-left space-y-1 w-full">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">Dashboard</h1>
            <p className="text-muted-foreground text-base">
              Welcome back, <span className="text-foreground font-medium">{user?.name || 'User'}</span>!
            </p>
          </div>

          <div className="w-full">
            <CarbonDashboardCard />
          </div>

          <CurrentDevelopmentCard {...devData} />

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm lg:mx-auto">
            <Link to="/profile/edit" className="flex-1">
              <Button
                variant="outline"
                className="w-full rounded-full h-10 font-medium gap-2"
              >
                <Settings className="w-4 h-4" />
                Profile Settings
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => logout()}
              className="flex-1 rounded-full h-10 font-medium border-destructive/20 text-destructive hover:bg-destructive/10! hover:text-destructive"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Sidebar / Nudges Card */}
        {profile?.skippedSections?.length > 0 && (
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl shadow-zinc-200/50 dark:shadow-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 italic">Complete Your Profile</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Incomplete Sections</p>
                </div>
              </div>

              <div className="space-y-3">
                {profile.skippedSections.map((section) => (
                  <Link key={section} to="/profile/edit" className="block group">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-3 flex items-center justify-between hover:border-primary/30 hover:bg-white dark:hover:bg-zinc-800 transition-all">
                      <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-primary transition-colors italic">{getNudgeText(section)}</p>
                      <div className="w-6 h-6 rounded-full bg-zinc-200/50 dark:bg-zinc-700/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OnboardingRedirect = () => {
  const { user } = useAuth();
  const { profile, fetchProfile, loading: profileLoading, isFetched: profileFetched, isProfileComplete } = useProfile();
  const { responses, fetchResponses, loading: carbonLoading } = useCarbonContext();
  const [hasFetchedResponses, setHasFetchedResponses] = useState(false);

  useEffect(() => {
    if (user && !profileFetched && !profileLoading) {
      fetchProfile();
    }
  }, [user, profileFetched, profileLoading, fetchProfile]);

  useEffect(() => {
    if (user && isProfileComplete && !responses && !carbonLoading && !hasFetchedResponses) {
      fetchResponses().then(() => setHasFetchedResponses(true));
    }
  }, [user, isProfileComplete, responses, carbonLoading, fetchResponses, hasFetchedResponses]);

  const isCarbonComplete = responses?.draftStatus === 'completed';
  const showProfileModal = user && profileFetched && !isProfileComplete;
  const showCarbonModal = user && isProfileComplete && responses !== null && !isCarbonComplete;

  return (
    <>
      <Outlet />
      <OnboardingModal isOpen={showProfileModal} />
      <CarbonContextOnboarding
        isOpen={showCarbonModal}
        onOpenChange={() => fetchResponses()}
      />
    </>
  );
};

const ThemeShortcut = () => {
  useThemeShortcut();
  return null;
};

function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <ThemeShortcut />
        <AuthProvider>
          <CarbonContextProvider>
            <ProfileProvider>
              <CarbonEstimationProvider>
                <div className="min-h-screen bg-background font-sans antialiased text-foreground">
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
              </CarbonEstimationProvider>
            </ProfileProvider>
          </CarbonContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;