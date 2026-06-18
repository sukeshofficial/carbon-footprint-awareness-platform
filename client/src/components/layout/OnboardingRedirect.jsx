import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../store/profileStore';
import { useCarbonContext } from '../../store/carbonContextStore';
import OnboardingModal from '../profile/OnboardingModal';
import CarbonContextOnboarding from '../onboarding/CarbonContextOnboarding';

/**
 * OnboardingRedirect sits inside a protected route and orchestrates the
 * sequential onboarding flow:
 *   1. Complete profile (ProfileOnboardingModal)
 *   2. Complete carbon context (CarbonContextOnboarding)
 *
 * Once both are done, it renders the child route content via <Outlet />.
 */
const OnboardingRedirect = () => {
  const { user } = useAuth();
  const { profile, fetchProfile, loading: profileLoading, isFetched: profileFetched, isProfileComplete } = useProfile();
  const { responses, fetchResponses, loading: carbonLoading } = useCarbonContext();
  const [hasFetchedResponses, setHasFetchedResponses] = useState(false);

  // Fetch profile only once per session after login
  useEffect(() => {
    if (user && !profileFetched && !profileLoading) {
      fetchProfile();
    }
  }, [user, profileFetched, profileLoading, fetchProfile]);

  // Fetch carbon context responses once profile is complete
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

export default OnboardingRedirect;
