import React, { useEffect, useState } from 'react';
import { useProfile } from '../store/profileStore';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileSummaryCard from '../components/profile/ProfileSummaryCard';
import AccountTab from '../components/profile/AccountTab';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Loader2, Settings, User, Car, Utensils, Zap, ShoppingBag, Palette, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

const TABS = [
  { id: 'account', label: 'Account' },
  { id: 'carbon', label: 'Carbon Profile' },
];

const EditProfile = () => {
  const { profile, updateProfile, fetchProfile, loading } = useProfile();
  const [activeTab, setActiveTab] = useState('account');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const handleSubmit = async (data) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const navItems = [
    { id: 'identity', title: 'Identity', icon: User },
    { id: 'transport', title: 'Transport', icon: Car },
    { id: 'food', title: 'Food', icon: Utensils },
    { id: 'energy', title: 'Energy', icon: Zap },
    { id: 'habits', title: 'Habits', icon: ShoppingBag },
    { id: 'lifestyle', title: 'Lifestyle', icon: Palette },
  ];

  if (!profile && loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* Premium Modern Header */}
      <div className="relative bg-[#064e3b] dark:bg-zinc-900 pt-10 pb-16 sm:pt-14 sm:pb-4 px-4 overflow-hidden border-b dark:border-zinc-800">
        {/* Animated Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/30 dark:bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        <div className="container max-w-6xl relative z-10">
          {/* Breadcrumbs */}
          {/* <nav className={cn(
            "fixed z-[100] transition-all duration-300",
            scrolled ? "top-2 left-2" : "top-2 left-2"
          )}>
            <Link
              to="/"
              className={cn(
                "group flex items-center justify-start rounded-full border transition-all duration-300 backdrop-blur-md shadow-2xl overflow-hidden whitespace-nowrap",
                scrolled
                  ? "bg-zinc-900/90 border-white/10 text-white"
                  : "bg-white/10 hover:bg-white/20 border-white/10 text-white",
                "w-11 h-11 hover:w-36 px-[13px] hover:px-4"
              )}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <div className="w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden ml-0 group-hover:ml-2.5">
                <span className="text-[11px] uppercase font-black tracking-widest leading-none">Dashboard</span>
              </div>
            </Link>
          </nav> */}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <Settings className="w-3 h-3 text-white/80" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/90">System Preferences</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                  Personal <span className="text-primary-foreground/60 italic font-serif">Profile</span>
                </h1>
                <p className="text-white/70 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
                  Customize your climate coaching experience and refine your impact profile for hyper-personalized insights.
                </p>
              </div>
            </div>

            {/* Profile Strength Meter */}
            {(() => {
              const score = profile?.profileCompletenessScore || 0;
              const segments = 10;
              const filledSegments = Math.round((score / 100) * segments);
              const label = score >= 100 ? 'Excellent' : score >= 66 ? 'Good' : score >= 33 ? 'Fair' : 'Getting started';
              const labelColor = score >= 100 ? 'text-emerald-400' : score >= 66 ? 'text-primary-foreground' : score >= 33 ? 'text-yellow-400' : 'text-white/60';
              return (
                <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 min-w-[260px]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1">Profile Strength</p>
                      <p className={`text-lg font-bold ${labelColor}`}>{label}</p>
                    </div>
                    <p className="text-4xl font-black text-white">{score}<span className="text-xl text-white/30">%</span></p>
                  </div>
                  {/* Segmented bar */}
                  <div className="flex gap-1">
                    {Array.from({ length: segments }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${i < filledSegments ? 'bg-emerald-400' : 'bg-white/10'
                          }`}
                        style={{ transitionDelay: `${i * 60}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-white/30 mt-3 font-medium">
                    {score < 100 ? `${100 - score}% remaining to unlock full insights` : 'Fully optimized for micro-coaching'}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Tab Navigation — bottom of header */}
          <div className="flex gap-1 mt-8 pt-4 border-t border-white/[0.1]">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-5 py-2 rounded-full text-sm font-bold transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-white dark:bg-primary text-[#064e3b] dark:text-primary-foreground shadow-lg scale-105'
                    : 'text-white/60 dark:text-zinc-400 hover:text-white dark:hover:text-zinc-200 hover:bg-white/10 dark:hover:bg-zinc-800/50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container max-w-6xl -mt-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Sticky Sidebar — only shown on Carbon tab */}
          <div className={cn('lg:col-span-4 space-y-6 lg:sticky lg:top-13', activeTab === 'account' && 'hidden lg:hidden')}>
            <ProfileSummaryCard profile={profile} />

            <Card className="p-2 border-none shadow-2xl shadow-primary/10 dark:shadow-black/20">
              <div className="px-4 pt-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Nav</span>
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              </div>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const el = document.getElementById(item.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Add highlight class
                        el.classList.add('highlight-section');
                        // Remove highlight class after animation finishes (2s)
                        setTimeout(() => {
                          el.classList.remove('highlight-section');
                        }, 2000);
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-all group"
                  >
                    <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    {item.title}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Form Content */}
          <div className={cn(activeTab === 'account' ? 'col-span-1 lg:col-span-10 lg:col-start-2' : 'lg:col-span-8')}>
            <Card className="py-0 mt-4 sm:mt-10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden bg-transparent">
              <div className="bg-white dark:bg-zinc-900 px-6 py-8 md:px-10 md:py-12 rounded-3xl">
                {activeTab === 'account' ? (
                  <AccountTab />
                ) : profile ? (
                  <ProfileForm
                    initialData={profile}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    buttonText="Update Carbon Profile"
                  />
                ) : (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
                  </div>
                )}
              </div>
            </Card>

            <div className="mt-6 text-center text-muted-foreground/50 text-xs font-medium">
              Your data is encrypted and used only for internal carbon estimations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
