import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useCarbonContext } from '../../store/carbonContextStore';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../store/profileStore';
import {
  Dialog,
  DialogContent,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Loader2, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

// Steps
import TransportStep from './TransportStep';
import DietStep from './DietStep';
import EnergyStep from './EnergyStep';
import ShoppingStep from './ShoppingStep';
import RoutineStep from './RoutineStep';
import LifestyleStep from './LifestyleStep';
import WasteStep from './WasteStep';
import CarbonContextReview from './CarbonContextReview';

/** Maps a step key to its corresponding data key in localData. */
function getContextKey(stepKey) {
  if (stepKey === 'routine') return 'workRoutine';
  if (stepKey === 'lifestyle') return 'lifestyleContext';
  if (stepKey === 'waste') return 'wasteProfile';
  return `${stepKey}Profile`;
}

const CarbonContextOnboarding = ({ isOpen, onOpenChange }) => {
  const {
    responses,
    questions,
    loading,
    fetchQuestions,
    fetchResponses,
    updateStep,
    skipStep,
    completeOnboarding
  } = useCarbonContext();
  const { user } = useAuth();
  const { profile, isProfileComplete } = useProfile();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [localData, setLocalData] = useState({});
  const stepperRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
      fetchResponses();
    }
  }, [isOpen, fetchQuestions, fetchResponses]);

  useEffect(() => {
    let syncedFromProfile = {};
    if (profile) {
      syncedFromProfile = syncFromProfileLocal(profile);
    }

    if (responses) {
      setCurrentStepIndex(responses.completionStep || 0);
      // Deep merge: profile data fills gaps in responses
      setLocalData({
        ...syncedFromProfile,
        ...responses,
        transportProfile: { ...syncedFromProfile.transportProfile, ...responses.transportProfile },
        foodProfile: { ...syncedFromProfile.foodProfile, ...responses.foodProfile },
        energyProfile: { ...syncedFromProfile.energyProfile, ...responses.energyProfile },
        shoppingProfile: { ...syncedFromProfile.shoppingProfile, ...responses.shoppingProfile },
        wasteProfile: { ...syncedFromProfile.wasteProfile, ...responses.wasteProfile },
        lifestyleContext: { ...syncedFromProfile.lifestyleContext, ...responses.lifestyleContext }
      });
    } else if (profile) {
      setLocalData(syncedFromProfile);
    }
  }, [responses, profile]);

  const syncFromProfileLocal = (p) => {
    const transportMappings = {
      'public': 'bus',
      'car': 'car',
      'bike': 'bike',
      'mixed': 'other',
      'walk': 'walking'
    };

    const dietMappings = {
      'vegan': 'vegetarian',
      'vegetarian': 'vegetarian',
      'pescatarian': 'mixed_diet',
      'omnivore': 'non_vegetarian',
      'mixed': 'mixed_diet'
    };

    const acMappings = {
      'none': 'none',
      'low': 'rarely',
      'moderate': 'occasionally',
      'high': 'frequently'
    };

    const dailyDist = p.transportProfile?.commuteDistance || 0;
    const freq = p.transportProfile?.travelFrequency || 'daily';
    let weeklyDist = dailyDist;
    if (freq === 'daily') weeklyDist = dailyDist * 7;
    else if (freq === 'moderate') weeklyDist = dailyDist * 3;
    else if (freq === 'rarely') weeklyDist = dailyDist * 1;

    return {
      transportProfile: {
        primaryMode: transportMappings[p.transportProfile?.primaryTransportMode] || p.transportProfile?.primaryTransportMode,
        weeklyCommuteDistance: weeklyDist,
        yearlyFlightFrequency: p.transportProfile?.flightFrequency
      },
      foodProfile: {
        dietStyle: dietMappings[p.foodProfile?.dietType] || p.foodProfile?.dietType
      },
      energyProfile: {
        acUsage: acMappings[p.energyProfile?.acUsage] || p.energyProfile?.acUsage
      },
      shoppingProfile: {
        onlineShoppingFrequency: p.shoppingProfile?.onlineShoppingFrequency,
        fashionPurchaseFrequency: p.shoppingProfile?.fashionPurchaseFrequency,
        gadgetUpgradeCycle: p.shoppingProfile?.gadgetUpgradeCycle
      },
      wasteProfile: {
        wasteSegregation: p.wasteProfile?.wasteSegregation,
        recyclingHabit: p.wasteProfile?.recyclingHabit,
        plasticUsage: p.wasteProfile?.plasticUsage
      },
      lifestyleContext: {
        householdSize: p.householdSize
      }
    };
  };

  const steps = questions?.steps || [];
  const totalSteps = steps.length;
  const isReviewStep = currentStepIndex === totalSteps;
  const currentStep = steps[currentStepIndex];

  const handleNext = async () => {
    if (isReviewStep) {
      try {
        await completeOnboarding();
        toast.success("Carbon context ready!");
        onOpenChange(false);
      } catch (err) {
        toast.error("Failed to complete onboarding");
      }
      return;
    }

    const stepKey = currentStep.key;
    const contextKey = getContextKey(stepKey);
    const stepData = localData[contextKey] || {};

    // Basic validation for required steps
    if (currentStep.required) {
      const requiredQuestions = currentStep.questions.filter(q => q.required);
      const isMissing = requiredQuestions.some(q => !stepData[q.key]);
      if (isMissing) {
        toast.error(`Please complete all required fields in ${currentStep.label}`);
        return;
      }
    }

    try {
      await updateStep(stepKey, stepData);
      setCurrentStepIndex(prev => prev + 1);
    } catch (err) {
      toast.error(err.message || "Failed to save progress");
    }
  };

  const handleSkip = async () => {
    try {
      await skipStep(currentStep.key);
      setCurrentStepIndex(prev => prev + 1);
      toast.info("Section skipped.");
    } catch (err) {
      toast.error("Failed to skip section");
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };

  const handleLocalChange = (stepData) => {
    const stepKey = currentStep.key;
    const contextKey = getContextKey(stepKey);
    setLocalData(prev => ({
      ...prev,
      [contextKey]: stepData
    }));
  };

  const checkScroll = () => {
    if (stepperRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = stepperRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [steps]);

  const scrollHandler = (direction) => {
    if (stepperRef.current) {
      const scrollAmount = 200;
      stepperRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getStepIndicatorContent = (index) => {
    if (currentStepIndex > index) {
      return <CheckCircle2 className="w-3 h-3" />;
    }
    return index + 1;
  };

  const getStepIndicatorClass = (index) => {
    if (currentStepIndex > index) {
      return "bg-green-500 text-white";
    }
    if (currentStepIndex === index) {
      return "bg-primary text-primary-foreground";
    }
    return "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500";
  };

  const renderStep = () => {
    if (isReviewStep) return <CarbonContextReview responses={localData} questions={questions} />;

    const stepKey = currentStep?.key;
    const contextKey = getContextKey(stepKey);
    const stepData = localData[contextKey] || {};

    switch (stepKey) {
      case 'travel': return <TransportStep data={stepData} onChange={handleLocalChange} />;
      case 'diet': return <DietStep data={stepData} onChange={handleLocalChange} />;
      case 'energy': return <EnergyStep data={stepData} onChange={handleLocalChange} />;
      case 'shopping': return <ShoppingStep data={stepData} onChange={handleLocalChange} />;
      case 'routine': return <RoutineStep data={stepData} onChange={handleLocalChange} />;
      case 'lifestyle': return <LifestyleStep data={stepData} onChange={handleLocalChange} />;
      case 'waste': return <WasteStep data={stepData} onChange={handleLocalChange} />;
      default: return <div>Step not found</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[calc(100%-2rem)] sm:w-full p-0 border-none bg-background dark:bg-zinc-950 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] h-auto sm:h-[750px]">
        {/* Header */}
        <div className="bg-primary px-5 py-6 sm:px-8 sm:py-8 text-primary-foreground border-b dark:border-zinc-800">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center p-2.5 shadow-inner shrink-0 text-center">
              <img src="/android-chrome-192x192.png" alt="" className="w-full h-full object-cover rounded-full shadow-sm" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                Carbon Context Onboarding
              </h2>
              <p className="text-primary-foreground/70 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="-w-1 rounded-full animate-pulse"></span>
                Lifestyle Signals
              </p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="relative border-b dark:border-zinc-800 group">
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-8 bg-gradient-to-r from-background dark:from-zinc-950 to-transparent pointer-events-none">
              <button
                type="button"
                onClick={() => scrollHandler('left')}
                className="w-7 h-7 ml-2 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border dark:border-zinc-700 shadow-xl pointer-events-auto hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
          )}

          <div
            className="px-4 py-3 flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth"
            ref={stepperRef}
            onScroll={checkScroll}
          >
            {steps.map((s, i) => (
              <React.Fragment key={s.key}>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all shrink-0",
                    currentStepIndex === i ? "bg-primary/10" : ""
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                    getStepIndicatorClass(i)
                  )}>
                    {getStepIndicatorContent(i)}
                  </div>
                  <span className={cn(
                    "text-[11px] font-bold",
                    currentStepIndex >= i ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600"
                  )}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && <div className="w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800 shrink-0" />}
              </React.Fragment>
            ))}
            <div className="w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0",
              isReviewStep ? "bg-primary/10" : ""
            )}>
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                isReviewStep ? "bg-primary text-primary-foreground" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
              )}>
                R
              </div>
              <span className={cn(
                "text-[11px] font-bold",
                isReviewStep ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600"
              )}>
                Review
              </span>
            </div>
          </div>

          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-8 bg-gradient-to-l from-background dark:from-zinc-950 to-transparent pointer-events-none">
              <button
                type="button"
                onClick={() => scrollHandler('right')}
                className="w-7 h-7 mr-2 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border dark:border-zinc-700 shadow-xl pointer-events-auto hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 py-6 sm:px-8 sm:py-8 flex-1 overflow-y-auto custom-scrollbar min-h-0">
          {loading && !questions ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            </div>
          ) : (
            renderStep()
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border-t dark:border-zinc-800 py-4 px-5 sm:py-5 sm:px-8 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStepIndex === 0 || loading}
            className="h-10 px-5 rounded-full font-bold text-xs"
          >
            Back
          </Button>

          <div className="flex items-center gap-3">
            {!isReviewStep && !currentStep?.required && (
              <Button
                variant="link"
                onClick={handleSkip}
                disabled={loading}
                className="text-muted-foreground text-xs font-medium hover:text-foreground underline underline-offset-4 decoration-muted-foreground/30"
              >
                Skip for now
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={loading}
              className="h-10 px-6 sm:px-8 rounded-full bg-primary hover:bg-primary/90 font-bold text-xs tracking-tight"
            >
              {loading && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
              {isReviewStep ? "Finish Setup" : "Continue"}
              {!isReviewStep && <ChevronRight className="w-3 h-3 ml-1" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

CarbonContextOnboarding.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func.isRequired,
};

export default CarbonContextOnboarding;
