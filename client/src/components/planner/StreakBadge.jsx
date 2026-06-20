import React from 'react';
import PropTypes from 'prop-types';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

const StreakBadge = ({
  currentStreak,
  longestStreak,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative group">
        <div
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center p-0.5',
            currentStreak > 0 ? 'bg-orange-500/10' : 'bg-gray-100'
          )}
        >
          <div
            className={cn(
              'w-full h-full rounded-full flex items-center justify-center transition-all duration-300',
              currentStreak > 0
                ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/20 scale-100'
                : 'bg-white scale-95'
            )}
          >
            <Flame
              className={cn(
                'w-7 h-7 transition-all duration-300',
                currentStreak > 0
                  ? 'text-white animate-pulse'
                  : 'text-gray-300'
              )}
            />
          </div>
        </div>

        {currentStreak > 0 && (
          <div className="absolute -top-1 -right-1 bg-white border border-orange-100 shadow-sm rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-[11px] font-bold text-orange-600">
              {currentStreak}
            </span>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
          Current Streak
        </p>
        <p className="text-xs font-semibold">
          {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
        </p>
      </div>

      {longestStreak > currentStreak && (
        <div className="mt-1 px-2 py-0.5 bg-orange-50 rounded-full border border-orange-100">
          <p className="text-[9px] font-medium text-orange-700">
            Best: {longestStreak}
          </p>
        </div>
      )}
    </div>
  );
};

StreakBadge.propTypes = {
  currentStreak: PropTypes.number,
  longestStreak: PropTypes.number,
  className: PropTypes.string,
};

StreakBadge.defaultProps = {
  currentStreak: 0,
  longestStreak: 0,
  className: '',
};

export default StreakBadge;
