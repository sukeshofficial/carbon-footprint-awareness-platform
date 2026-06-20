import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import UserTypeCards from './UserTypeCards';
import ToneSelector from './ToneSelector';
import HouseholdSelector from './HouseholdSelector';
import { useProfile } from '../../store/profileStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

const OnboardingModal = ({ isOpen }) => {
  const { saveProfile, updateProfile, profile, loading } = useProfile();
  const stepperRef = useRef(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: '',
    cityRegion: '',
    ageGroup: '',
    userType: 'student',
    householdType: 'shared_home',
    householdSize: 1,
    tonePreference: 'friendly_motivator',
    // New Category Fields
    transportProfile: {
      primaryTransportMode: 'mixed',
      commuteDistance: 0,
      travelFrequency: 'moderate',
      flightFrequency: 0,
    },
    foodProfile: {
      dietType: 'mixed',
      foodOrderingFrequency: 'average',
      groceryPreference: 'supermarket',
    },
    energyProfile: {
      electricityUsage: 0,
      acUsage: 'moderate',
      applianceCount: 0,
    },
    shoppingProfile: {
      onlineShoppingFrequency: 'moderate',
      fashionPurchaseFrequency: 'moderate',
      gadgetUpgradeCycle: 'balanced',
    },
    wasteProfile: {
      wasteSegregation: 'sometimes',
      recyclingHabit: 'sometimes',
      plasticUsage: 'moderate',
    },
    skippedSections: [],
    completionStep: 1,
    profileCompletenessScore: 0,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateCompleteness = (data) => {
    let score = 0;
    if (data.displayName && data.cityRegion) score += 20;
    if (data.userType && data.householdType) score += 20;
    if (data.tonePreference) score += 10;

    // Optional sections add 10% each if not empty/default
    const optionalSections = ['transportProfile', 'foodProfile', 'energyProfile', 'shoppingProfile', 'wasteProfile'];
    optionalSections.forEach(section => {
      if (!formData.skippedSections.includes(section)) score += 10;
    });
    return Math.min(score, 100);
  };

  const autoSave = async (currentData, currentStep, isSkipped = false, sectionName = null) => {
    try {
      const updatedData = {
        ...currentData,
        completionStep: currentStep,
        profileCompletenessScore: calculateCompleteness(currentData),
      };

      if (isSkipped && sectionName && !updatedData.skippedSections.includes(sectionName)) {
        updatedData.skippedSections = [...updatedData.skippedSections, sectionName];
      }

      // If it's step 8, mark as complete if required fields are present
      if (currentStep === 8 && updatedData.tonePreference) {
        updatedData.isOnboardingCompleted = true;
      }

      const saved = profile
        ? await updateProfile(updatedData)
        : await saveProfile(updatedData);

      setFormData(saved);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const nextStep = async () => {
    // Validation for required steps
    if (step === 1) {
      if (!formData.displayName || !formData.cityRegion) {
        toast.error('Required fields: Display Name and City/Region');
        return;
      }
    }
    if (step === 2) {
      if (!formData.userType || !formData.householdType) {
        toast.error('Required fields: User Type and Household Type');
        return;
      }
    }

    const nextS = Math.min(step + 1, 8);
    await autoSave(formData, nextS);
    setStep(nextS);

    if (step === 8) {
      toast.success('Onboarding completed!');
    }
  };

  const skipStep = async (sectionName) => {
    const nextS = Math.min(step + 1, 8);
    await autoSave(formData, nextS, true, sectionName);
    setStep(nextS);
    toast.info(`Section skipped. You can complete it later in Settings.`);
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      const finalData = {
        ...formData,
        completionStep: 8,
        isOnboardingCompleted: true,
        profileCompletenessScore: calculateCompleteness(formData)
      };
      await saveProfile(finalData);
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    }
  };

  const STEPS = [
    { id: 1, title: 'Identity', required: true },
    { id: 2, title: 'Lifestyle', required: true },
    { id: 3, title: 'Transport', required: false, section: 'transportProfile' },
    { id: 4, title: 'Food', required: false, section: 'foodProfile' },
    { id: 5, title: 'Energy', required: false, section: 'energyProfile' },
    { id: 6, title: 'Shopping', required: false, section: 'shoppingProfile' },
    { id: 7, title: 'Waste', required: false, section: 'wasteProfile' },
    { id: 8, title: 'Tone', required: true },
  ];

  useEffect(() => {
    if (stepperRef.current) {
      const activeEl = stepperRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [step]);

  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent
        className="max-w-2xl w-[calc(100%-2rem)] sm:w-full p-0 border-none bg-background shadow-2xl rounded-3xl sm:rounded-4xl! overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] h-auto sm:h-[700px]"
      >
        {/* Header Section */}
        <div className="bg-primary px-5 py-6 sm:px-8 sm:py-8 text-primary-foreground">
          <div className="max-w-2xl mx-auto space-y-1">
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-full backdrop-blur-sm text-sm"><img src="/android-chrome-192x192.png" alt="" className='rounded-full' /></span>
              ACo2 Setup
            </h2>
            <p className="text-primary-foreground/80 text-[10px] sm:text-xs font-medium">
              Join thousands making a difference. Let's personalize your journey.
            </p>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="relative group/stepper border bg-card rounded-full ml-4 mr-4 mt-4 overflow-hidden">
          {/* Scroll Buttons */}
          <button
            onClick={() => stepperRef.current?.scrollBy({ left: -150, behavior: 'smooth' })}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-background/80 backdrop-blur-sm border rounded-full flex items-center justify-center opacity-0 group-hover/stepper:opacity-100 transition-opacity shadow-sm hover:bg-background"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          <div
            ref={stepperRef}
            className="flex overflow-x-auto no-scrollbar scroll-smooth px-2"
          >
            {STEPS.map((s) => (
              <div
                key={s.id}
                data-active={step === s.id}
                className={cn(
                  "flex-none relative py-3 rounded-full m-1 px-4 flex items-center justify-center transition-all duration-300 min-w-fit",
                  step === s.id ? 'bg-primary/10' : ''
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold shrink-0",
                    step >= s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {s.id}
                  </span>
                  <span className={cn(
                    "text-xs font-bold tracking-tight whitespace-nowrap",
                    step >= s.id ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {s.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => stepperRef.current?.scrollBy({ left: 150, behavior: 'smooth' })}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-background/80 backdrop-blur-sm border rounded-full flex items-center justify-center opacity-0 group-hover/stepper:opacity-100 transition-opacity shadow-sm hover:bg-background"
          >
            <ChevronRight className="w-3 h-3" />
          </button>

          {/* Right/Left Gradient Indicators */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent pointer-events-none opacity-100 transition-opacity group-hover/stepper:opacity-0" />
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-card to-transparent pointer-events-none opacity-100 transition-opacity group-hover/stepper:opacity-0" />
        </div>

        {/* Form Content */}
        <div className="px-5 py-6 sm:px-8 sm:py-8 flex-1 overflow-y-auto custom-scrollbar min-h-0">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid gap-2">
                <Label htmlFor="displayName" className="text-sm font-bold">
                  Display Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="displayName"
                  className="h-11 rounded-full border-zinc-200 focus-visible:ring-primary/20"
                  placeholder="How should we call you?"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cityRegion" className="text-sm font-bold">
                  City / Region <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cityRegion"
                  className="h-11 rounded-full border-zinc-200 focus-visible:ring-primary/20"
                  placeholder="e.g. London, Tokyo, Chennai"
                  value={formData.cityRegion}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ageGroup" className="text-sm font-bold">Age Group (Optional)</Label>
                <Input
                  id="ageGroup"
                  className="h-11 rounded-full border-zinc-200 focus-visible:ring-primary/20"
                  placeholder="e.g. 18-24, 25-34"
                  value={formData.ageGroup}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-3">
                <Label className="text-sm font-bold">
                  Lifestyle Archetype <span className="text-destructive">*</span>
                </Label>
                <UserTypeCards
                  selected={formData.userType}
                  onChange={(val) => handleSelectChange('userType', val)}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold">
                  Household Setup <span className="text-destructive">*</span>
                </Label>
                <HouseholdSelector
                  selected={formData.householdType}
                  onChange={(val) => handleSelectChange('householdType', val)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="householdSize" className="text-sm font-bold">Household Size (People)</Label>
                <Input
                  id="householdSize"
                  type="number"
                  min="1"
                  max="20"
                  className="h-11 rounded-full border-zinc-200 focus-visible:ring-primary/20"
                  placeholder="How many people live with you?"
                  value={formData.householdSize}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleSelectChange('householdSize', val === '' ? '' : Number.parseInt(val));
                  }}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center py-4 bg-primary/5 rounded-2xl border border-primary/10">
                <h3 className="text-base font-bold tracking-tight">Transport Profile</h3>
                <p className="text-muted-foreground text-xs">Help us estimate your travel footprint.</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold">Primary Transport Mode</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Public', 'Car', 'Bike', 'Mixed', 'Walk'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleSelectChange('transportProfile', { ...formData.transportProfile, primaryTransportMode: mode.toLowerCase() })}
                        className={cn(
                          "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                          formData.transportProfile.primaryTransportMode === mode.toLowerCase() ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="commuteDistance" className="text-sm font-bold">Daily Commute (km)</Label>
                  <Input
                    id="commuteDistance"
                    type="number"
                    className="h-11 rounded-full"
                    placeholder="Distance in km"
                    value={formData.transportProfile.commuteDistance}
                    onChange={(e) => handleSelectChange('transportProfile', { ...formData.transportProfile, commuteDistance: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              {/* Skip button is now in footer */}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center py-4 bg-primary/5 rounded-2xl border border-primary/10">
                <h3 className="text-base font-bold tracking-tight">Food Profile</h3>
                <p className="text-muted-foreground text-xs">Your diet has a significant carbon impact.</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold">Diet Type</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Vegan', 'Vegetarian', 'Pescatarian', 'Omnivore', 'Mixed'].map((diet) => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => handleSelectChange('foodProfile', { ...formData.foodProfile, dietType: diet.toLowerCase() })}
                        className={cn(
                          "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                          formData.foodProfile.dietType === diet.toLowerCase() ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"
                        )}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold">Ordering Frequency</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Rarely', 'Weekly', 'Daily'].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => handleSelectChange('foodProfile', { ...formData.foodProfile, foodOrderingFrequency: freq.toLowerCase() })}
                        className={cn(
                          "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                          formData.foodProfile.foodOrderingFrequency === freq.toLowerCase() ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"
                        )}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center py-4 bg-primary/5 rounded-2xl border border-primary/10">
                <h3 className="text-base font-bold tracking-tight">Home Energy</h3>
                <p className="text-muted-foreground text-xs">Estimate your home heating and electricity impact.</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="electricityUsage" className="text-sm font-bold">Avg Monthly Electricity (kWh)</Label>
                  <Input
                    id="electricityUsage"
                    type="number"
                    className="h-11 rounded-full"
                    placeholder="kWh per month"
                    value={formData.energyProfile.electricityUsage}
                    onChange={(e) => handleSelectChange('energyProfile', { ...formData.energyProfile, electricityUsage: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold">AC Usage</Label>
                  <div className="flex flex-wrap gap-2">
                    {['None', 'Low', 'Moderate', 'High'].map((usage) => (
                      <button
                        key={usage}
                        type="button"
                        onClick={() => handleSelectChange('energyProfile', { ...formData.energyProfile, acUsage: usage.toLowerCase() })}
                        className={cn(
                          "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                          formData.energyProfile.acUsage === usage.toLowerCase() ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"
                        )}
                      >
                        {usage}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center py-4 bg-primary/5 rounded-2xl border border-primary/10">
                <h3 className="text-base font-bold tracking-tight">Shopping Behavior</h3>
                <p className="text-muted-foreground text-xs">Consumption patterns define your lifestyle footprint.</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold">Online Shopping Frequency</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Rarely', 'Monthly', 'Weekly'].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => handleSelectChange('shoppingProfile', { ...formData.shoppingProfile, onlineShoppingFrequency: freq.toLowerCase() })}
                        className={cn(
                          "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                          formData.shoppingProfile.onlineShoppingFrequency === freq.toLowerCase() ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"
                        )}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center py-4 bg-primary/5 rounded-2xl border border-primary/10">
                <h3 className="text-base font-bold tracking-tight">Waste & Sustainability</h3>
                <p className="text-muted-foreground text-xs">Small habits lead to big changes.</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold">Recycling Habit</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Never', 'Sometimes', 'Always'].map((habit) => (
                      <button
                        key={habit}
                        type="button"
                        onClick={() => handleSelectChange('wasteProfile', { ...formData.wasteProfile, recyclingHabit: habit.toLowerCase() })}
                        className={cn(
                          "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                          formData.wasteProfile.recyclingHabit === habit.toLowerCase() ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"
                        )}
                      >
                        {habit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center py-4 bg-primary/5 rounded-2xl border border-primary/10">
                <h3 className="text-base font-bold tracking-tight">
                  Set Your Coaching Vibe{' '}
                  <span className="text-destructive">*</span>
                </h3>
                <p className="text-muted-foreground text-xs px-4">
                  AI adapts its tone based on your preference.
                </p>
              </div>
              <ToneSelector
                selected={formData.tonePreference}
                onChange={(val) => handleSelectChange('tonePreference', val)}
              />
            </div>
          )}
        </div>

        {/* Shaded Footer */}
        <div className="bg-zinc-50 border-t py-4 px-5 sm:py-5 sm:px-8 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {step > 1 && (
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={loading}
                className="h-10 px-5 rounded-full font-bold text-xs"
              >
                Back
              </Button>
            )}

            {/* Step Indicators */}
            <div className="hidden sm:flex items-center gap-1 ml-2">
              {[...new Array(8)].map((_, i) => (
                <div
                  key={`step-indicator-${i + 1}`}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    step === i + 1 ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {STEPS[step - 1].required === false && (
              <Button
                variant="link"
                onClick={() => skipStep(STEPS[step - 1].section)}
                className="text-muted-foreground text-xs font-medium hover:text-foreground underline decoration-muted-foreground/30 underline-offset-4"
              >
                Skip for now
              </Button>
            )}

            <Button
              onClick={step < 8 ? nextStep : handleSubmit}
              disabled={loading}
              className="h-10 px-6 sm:px-8 rounded-full bg-primary hover:bg-primary/90 font-bold text-xs tracking-tight min-w-fit sm:min-w-[120px]"
            >
              {loading ? (
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              ) : null}
              {step < 8 ? (
                <>
                  Continue
                  <ChevronRight className="w-3 h-3 ml-1" />
                </>
              ) : (
                'Start Coaching'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

OnboardingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default OnboardingModal;
