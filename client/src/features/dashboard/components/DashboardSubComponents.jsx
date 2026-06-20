import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { User as UserIcon, ChevronRight, Leaf, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PROFILE_NUDGES } from '../constants/dashboardConstants';

export const DashboardLoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary/40" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Calculating your carbon impact...
      </p>
    </div>
  </div>
);

export const DashboardEmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-8 animate-bounce">
      <Leaf size={40} />
    </div>
    <h2 className="text-2xl font-black text-slate-900 dark:text-zinc-50 mb-3 italic">
      Start Your Green Journey
    </h2>
    <p className="text-muted-foreground text-sm max-w-md mb-10 leading-relaxed font-medium">
      We couldn't find your carbon footprint data. Complete the onboarding to see your impact, get personalized tips, and start reducing your emissions.
    </p>
    <Link to="/onboarding">
      <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold italic shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
        Complete Onboarding
      </Button>
    </Link>
  </div>
);

export const ProfileNudgeCard = ({ skippedSections }) => {
  if (!skippedSections?.length) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <UserIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-zinc-100 italic">
            Complete Profile
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
            Accuracy: Low
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {skippedSections.map((section) => (
          <Link key={section} to="/profile/edit" className="block group">
            <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between hover:border-primary/30 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300">
              <p className="text-xs font-bold text-slate-600 dark:text-zinc-400 group-hover:text-primary transition-colors italic leading-snug pr-4">
                {PROFILE_NUDGES[section] ?? section}
              </p>
              <div className="w-7 h-7 rounded-full bg-slate-200/50 dark:bg-zinc-700/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

ProfileNudgeCard.propTypes = {
  skippedSections: PropTypes.arrayOf(PropTypes.string),
};