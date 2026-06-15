import React from 'react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import UserTypeCards from './UserTypeCards';
import ToneSelector from './ToneSelector';
import HouseholdSelector from './HouseholdSelector';
import {
  User,
  Car,
  Utensils,
  Zap,
  ShoppingBag,
  Palette,
  Loader2
} from 'lucide-react';
import {
  TRANSPORT_MODES,
  DIET_TYPES,
  FREQUENCY_OPTIONS,
  AC_USAGE_OPTIONS,
  WASTE_HABIT_OPTIONS,
  RECYCLING_HABITS,
  WASTE_SEGREGATION_LEVELS,
  PLASTIC_USAGE_LEVELS,
  FASHION_PURCHASE_FREQUENCIES,
  GADGET_UPGRADE_CYCLES,
  WORK_ROUTINES,
  CITY_TYPES,
  USAGE_LEVELS
} from './constants';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display Name is required').max(50),
  cityRegion: z.string().min(1, 'City/Region is required').max(100),
  householdType: z.string().min(1, 'Household Type is required'),
  userType: z.string().min(1, 'User Type is required'),
  tonePreference: z.string().min(1, 'Tone Preference is required'),
  ageGroup: z.string().optional(),
  householdSize: z.coerce.number().int().positive().optional(),
  transportProfile: z.object({
    primaryTransportMode: z.string().optional(),
    secondaryTransportMode: z.string().optional(),
    commuteDistance: z.coerce.number().optional(),
    weeklyCommuteDistance: z.coerce.number().optional(),
    travelFrequency: z.string().optional(),
    flightFrequency: z.coerce.number().optional(),
  }).optional(),
  foodProfile: z.object({
    dietType: z.string().optional(),
    foodOrderingFrequency: z.string().optional(),
    groceryPreference: z.string().optional(),
  }).optional(),
  energyProfile: z.object({
    electricityUsage: z.coerce.number().optional(),
    acUsage: z.string().optional(),
    fanUsage: z.string().optional(),
    applianceCount: z.coerce.number().optional(),
    billAwareness: z.boolean().optional(),
  }).optional(),
  shoppingProfile: z.object({
    onlineShoppingFrequency: z.string().optional(),
    fashionPurchaseFrequency: z.string().optional(),
    gadgetUpgradeCycle: z.string().optional(),
  }).optional(),
  wasteProfile: z.object({
    wasteSegregation: z.string().optional(),
    recyclingHabit: z.string().optional(),
    plasticUsage: z.string().optional(),
  }).optional(),
  workRoutine: z.object({
    type: z.string().optional(),
  }).optional(),
  lifestyleContext: z.object({
    cityType: z.string().optional(),
  }).optional(),
});

const ProfileForm = ({ initialData, onSubmit, isLoading, buttonText = 'Save Profile' }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData || {
      displayName: '',
      cityRegion: '',
      householdType: 'shared_home',
      userType: 'student',
      tonePreference: 'friendly_motivator',
      ageGroup: '',
      householdSize: 1,
      transportProfile: {
        primaryTransportMode: 'mixed',
        secondaryTransportMode: 'none',
        commuteDistance: 0,
        weeklyCommuteDistance: 0,
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
        fanUsage: 'none',
        applianceCount: 0,
        billAwareness: false,
      },
      shoppingProfile: {
        onlineShoppingFrequency: 'moderate',
        fashionPurchaseFrequency: 'moderate',
        gadgetUpgradeCycle: 'balanced',
      },
      wasteProfile: {
        wasteSegregation: 'sometimes',
        recyclingHabit: 'occasionally',
        plasticUsage: 'moderate',
      },
      workRoutine: {
        type: 'offline_commute',
      },
      lifestyleContext: {
        cityType: 'metropolitan',
      },
    },
  });


  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 border-b pb-2 mb-4 sm:mb-6">
      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg text-primary">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <h3 className="text-base sm:text-lg font-bold tracking-tight">{title}</h3>
    </div>
  );

  const CustomSelect = ({ label, register, options, disabled }) => {
    const [subIsOpen, setSubIsOpen] = useState(false);

    return (
      <div className="grid gap-2">
        {label && <Label>{label}</Label>}
        <div className="relative">
          <select
            {...register}
            className="flex appearance-none h-10 sm:h-11 w-full rounded-full border border-input bg-background px-4 py-2 pr-10 text-sm ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            disabled={disabled}
            onBlur={() => setSubIsOpen(false)}
            onFocus={() => setSubIsOpen(true)}
          >
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.title}
              </option>
            ))}
          </select>

          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground/60 transition-transform duration-300"
            style={{
              perspective: "1000px",
              transform: subIsOpen ? "rotateX(-180deg)" : "rotateY(0deg)",
            }}
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {/* Identity Section */}
      <div id="identity" className="space-y-6 scroll-mt-24 p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/50">
        <SectionHeader icon={User} title="Basic Identity" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="How should we call you?"
              {...register('displayName')}
              disabled={isLoading}
            />
            {errors.displayName && (
              <p className="text-sm text-destructive">{String(errors.displayName.message)}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cityRegion">City / Region</Label>
            <Input
              id="cityRegion"
              placeholder="e.g. London, Tokyo"
              {...register('cityRegion')}
              disabled={isLoading}
              className="h-10 sm:h-11"
            />
            {errors.cityRegion && (
              <p className="text-sm text-destructive">{String(errors.cityRegion.message)}</p>
            )}
          </div>
          <CustomSelect
            label="City Type"
            register={register('lifestyleContext.cityType')}
            options={CITY_TYPES}
            disabled={isLoading}
          />
          <div className="grid gap-2">
            <Label htmlFor="ageGroup">Age Group (Optional)</Label>
            <Input
              id="ageGroup"
              placeholder="e.g. 18-24, 25-34"
              {...register('ageGroup')}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="householdSize">Household Size (People)</Label>
            <Input
              id="householdSize"
              type="number"
              min="1"
              {...register('householdSize')}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      {/* Transport Section */}
      <div id="transport" className="space-y-6 scroll-mt-24 p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/50">
        <SectionHeader icon={Car} title="Transport & Mobility" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CustomSelect
            label="Primary Transport Mode"
            register={register("transportProfile.primaryTransportMode")}
            options={TRANSPORT_MODES}
            disabled={isLoading}
          />
          <CustomSelect
            label="Secondary Transport Mode"
            register={register("transportProfile.secondaryTransportMode")}
            options={TRANSPORT_MODES}
            disabled={isLoading}
          />
          <div className="grid gap-2">
            <Label>Daily Commute (km)</Label>
            <Input
              type="number"
              {...register('transportProfile.commuteDistance')}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label>Weekly Commute (km)</Label>
            <Input
              type="number"
              {...register('transportProfile.weeklyCommuteDistance')}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label>Flights Per Year</Label>
            <Input
              type="number"
              {...register('transportProfile.flightFrequency')}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Food Section */}
      <div id="food" className="space-y-6 scroll-mt-24 p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/50">
        <SectionHeader icon={Utensils} title="Food & Diet" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CustomSelect
            label="Diet Type"
            register={register('foodProfile.dietType')}
            options={DIET_TYPES}
            disabled={isLoading}
          />
          <CustomSelect
            label="Ordering Frequency"
            register={register('foodProfile.foodOrderingFrequency')}
            options={FREQUENCY_OPTIONS}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Energy Section */}
      <div id="energy" className="space-y-6 scroll-mt-24 p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/50">
        <SectionHeader icon={Zap} title="Home Energy" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label>Electricity Usage (Avg/Month)</Label>
            <Input
              type="number"
              {...register('energyProfile.electricityUsage')}
              placeholder="e.g. 200 kWh"
              disabled={isLoading}
            />
          </div>
          <CustomSelect
            label="AC Usage"
            register={register('energyProfile.acUsage')}
            options={AC_USAGE_OPTIONS}
            disabled={isLoading}
          />
          <CustomSelect
            label="Fan Usage"
            register={register('energyProfile.fanUsage')}
            options={USAGE_LEVELS}
            disabled={isLoading}
          />
          <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Electricity Bill Awareness</Label>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Do you track your monthly usage?</p>
            </div>
            <Controller
              name="energyProfile.billAwareness"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Shopping & Waste Section */}
      <div id="habits" className="space-y-6 scroll-mt-24 p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/50">
        <SectionHeader icon={ShoppingBag} title="Shopping & Waste" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CustomSelect
            label="Online Shopping"
            register={register('shoppingProfile.onlineShoppingFrequency')}
            options={FREQUENCY_OPTIONS}
            disabled={isLoading}
          />
          <CustomSelect
            label="Fashion Purchase"
            register={register('shoppingProfile.fashionPurchaseFrequency')}
            options={FASHION_PURCHASE_FREQUENCIES}
            disabled={isLoading}
          />
          <CustomSelect
            label="Gadget Upgrade Cycle"
            register={register('shoppingProfile.gadgetUpgradeCycle')}
            options={GADGET_UPGRADE_CYCLES}
            disabled={isLoading}
          />
          <CustomSelect
            label="Waste Segregation"
            register={register('wasteProfile.wasteSegregation')}
            options={WASTE_SEGREGATION_LEVELS}
            disabled={isLoading}
          />
          <CustomSelect
            label="Recycling Habit"
            register={register('wasteProfile.recyclingHabit')}
            options={RECYCLING_HABITS}
            disabled={isLoading}
          />
          <CustomSelect
            label="Plastic Usage"
            register={register('wasteProfile.plasticUsage')}
            options={PLASTIC_USAGE_LEVELS}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Routine Section */}
      <div id="routine" className="space-y-6 scroll-mt-24 p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/50">
        <SectionHeader icon={Palette} title="Daily Routine" />
        <CustomSelect
          label="What best describes your daily routine?"
          register={register('workRoutine.type')}
          options={WORK_ROUTINES}
          disabled={isLoading}
        />
      </div>

      {/* Lifestyle & Tone Section */}
      <div id="lifestyle" className="space-y-8 scroll-mt-24 p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/50">
        <SectionHeader icon={Palette} title="Lifestyle & Tone" />

        <div className="space-y-4">
          <Label>What best describes you?</Label>
          <Controller
            name="userType"
            control={control}
            render={({ field }) => (
              <UserTypeCards selected={field.value} onChange={field.onChange} />
            )}
          />
          {errors.userType && (
            <p className="text-sm text-destructive">{String(errors.userType.message)}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Household Type</Label>
          <Controller
            name="householdType"
            control={control}
            render={({ field }) => (
              <HouseholdSelector selected={field.value} onChange={field.onChange} />
            )}
          />
          {errors.householdType && (
            <p className="text-sm text-destructive">{String(errors.householdType.message)}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Coaching Tone Preference</Label>
          <Controller
            name="tonePreference"
            control={control}
            render={({ field }) => (
              <ToneSelector selected={field.value} onChange={field.onChange} />
            )}
          />
          {errors.tonePreference && (
            <p className="text-sm text-destructive">{String(errors.tonePreference.message)}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base font-bold" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Saving...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
};

export default ProfileForm;
