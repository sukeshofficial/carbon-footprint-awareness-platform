import React from 'react';
import PropTypes from 'prop-types';
import ActionCard from './ActionCard';
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const DailyActionHero = ({ action, onComplete, onSkip }) => {
  if (!action) {
    return (
      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-muted-foreground" />
          </div>

          <CardTitle className="text-lg">No action for today</CardTitle>
          <CardDescription>
            Generate a plan to start your sustainability journey.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Today&apos;s Focus
        </h3>

        {action.status === 'completed' && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            Great job!
          </span>
        )}
      </div>

      <ActionCard
        action={action}
        onComplete={onComplete}
        onSkip={onSkip}
      />
    </div>
  );
};

DailyActionHero.propTypes = {
  action: PropTypes.shape({
    _id: PropTypes.string,
    status: PropTypes.oneOf(['pending', 'completed', 'skipped']),
    title: PropTypes.string,
    description: PropTypes.string,
    effortLevel: PropTypes.oneOf(['low', 'easy', 'medium', 'high']),
    impactEstimate: PropTypes.number,
    carbonUnit: PropTypes.string,
    savingsCurrencyEstimate: PropTypes.number,
  }),
  onComplete: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

export default DailyActionHero;
