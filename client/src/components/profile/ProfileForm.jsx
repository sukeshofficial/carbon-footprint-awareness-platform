import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
  WASTE_HABIT_OPTIONS
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
    commuteDistance: z.coerce.number().optional(),
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
    applianceCount: z.coerce.number().optional(),
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {/* Identity Section */}
      <div id="identity" className="space-y-6 scroll-mt-24">
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
      <div id="transport" className="space-y-6 scroll-mt-24">
        <SectionHeader icon={Car} title="Transport & Mobility" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label>Primary Transport Mode</Label>
            <select
              {...register('transportProfile.primaryTransportMode')}
              className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
              disabled={isLoading}
            >
              {TRANSPORT_MODES.map(mode => (
                <option key={mode.id} value={mode.id}>{mode.title}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Daily Commute (km)</Label>
            <Input
              type="number"
              {...register('transportProfile.commuteDistance')}
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
      <div id="food" className="space-y-6 scroll-mt-24">
        <SectionHeader icon={Utensils} title="Food & Diet" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label>Diet Type</Label>
            <select
              {...register('foodProfile.dietType')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
              disabled={isLoading}
            >
              {DIET_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.title}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Ordering Frequency</Label>
            <select
              {...register('foodProfile.foodOrderingFrequency')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
              disabled={isLoading}
            >
              {FREQUENCY_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Energy Section */}
      <div id="energy" className="space-y-6 scroll-mt-24">
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
          <div className="grid gap-2">
            <Label>AC Usage</Label>
            <select
              {...register('energyProfile.acUsage')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
              disabled={isLoading}
            >
              {AC_USAGE_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Shopping & Waste Section */}
      <div id="habits" className="space-y-6 scroll-mt-24">
        <SectionHeader icon={ShoppingBag} title="Shopping & Waste" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label>Online Shopping</Label>
            <select
              {...register('shoppingProfile.onlineShoppingFrequency')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
              disabled={isLoading}
            >
              {FREQUENCY_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.title}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Waste Segregation Habit</Label>
            <select
              {...register('wasteProfile.wasteSegregation')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
              disabled={isLoading}
            >
              {WASTE_HABIT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lifestyle & Tone Section */}
      <div id="lifestyle" className="space-y-8 scroll-mt-24">
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
