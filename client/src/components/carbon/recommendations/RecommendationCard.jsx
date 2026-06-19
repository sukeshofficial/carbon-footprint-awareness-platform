import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '../../ui/card';
import { Button } from '../../ui/button';
import EffortBadge from './EffortBadge';
import ImpactBadge from './ImpactBadge';
import MoneySavingsBadge from './MoneySavingsBadge';
import { Check, X, Info, Leaf } from 'lucide-react';
import { cn } from '../../../lib/utils';

const RecommendationCard = ({
  recommendation,
  onAccept,
  onDismiss,
  className = ""
}) => {
  const {
    _id,
    title,
    description,
    co2SavedEstimate,
    moneySavedEstimate,
    effortLevel,
    impactScore,
    reasonText,
    status,
    isTopPriority
  } = recommendation;

  return (
    <Card className={cn(
      "group relative border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5",
      isTopPriority && "ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/5",
      status === 'dismissed' && "opacity-50 grayscale",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <ImpactBadge score={impactScore} />
              <EffortBadge level={effortLevel} />
              <MoneySavingsBadge amount={moneySavedEstimate} />
            </div>
            <CardTitle className="text-lg font-black tracking-tight text-slate-900 dark:text-zinc-50 leading-tight">
              {title}
            </CardTitle>
          </div>
          {isTopPriority && (
            <CardAction>
              <div className="bg-primary/10 text-primary p-2 rounded-full ring-4 ring-primary/5 animate-pulse">
                <Leaf size={18} className="fill-current" />
              </div>
            </CardAction>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
          {description}
        </CardDescription>

        <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-700/50">
          <div className="bg-emerald-500/10 text-emerald-600 p-2 rounded-xl">
            <Info size={14} />
          </div>
          <p className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 leading-tight">
            {reasonText}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Est. Weekly Savings</span>
            <span className="text-xl font-black text-emerald-600 tracking-tight">-{co2SavedEstimate} kg <span className="text-xs uppercase font-black">CO₂</span></span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2 pb-5">
        {status === 'active' ? (
          <>
            <Button
              onClick={() => onAccept(_id)}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-black rounded-xl h-10 shadow-lg shadow-primary/20"
            >
              <Check size={16} className="mr-2" />
              I'll do this
            </Button>
            <Button
              variant="outline"
              onClick={() => onDismiss(_id)}
              className="px-3 border-slate-200 dark:border-zinc-800 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 dark:hover:border-rose-500/20 font-black rounded-xl h-10 transition-colors"
            >
              <X size={16} />
            </Button>
          </>
        ) : (
          <div className="w-full text-center py-2 px-4 bg-slate-100 dark:bg-zinc-800 rounded-xl">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">
              {status === 'accepted' ? 'Added to your list' : 'Dismissed'}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

RecommendationCard.propTypes = {
  recommendation: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    co2SavedEstimate: PropTypes.number.isRequired,
    moneySavedEstimate: PropTypes.number,
    effortLevel: PropTypes.string.isRequired,
    impactScore: PropTypes.number.isRequired,
    reasonText: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    isTopPriority: PropTypes.bool
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default RecommendationCard;
