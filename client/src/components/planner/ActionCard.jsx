import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckCircle2, TrendingDown, Circle, SkipForward } from 'lucide-react';
import { cn } from '../../lib/utils';

const ActionCard = ({ action, onComplete, onSkip, compact = false }) => {
  const effortColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusIcons = {
    pending: <Circle className="w-5 h-5 text-gray-300" />,
    completed: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    skipped: <SkipForward className="w-5 h-5 text-gray-400" />,
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      action.status === 'completed' ? "bg-green-50/30 border-green-100" : "hover:border-primary/20",
      compact ? "p-3" : "p-4"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {statusIcons[action.status]}
            <h4 className={cn(
              "font-semibold tracking-tight",
              compact ? "text-sm" : "text-base",
              action.status === 'completed' && "text-gray-500 line-through"
            )}>
              {action.title}
            </h4>
          </div>

          {!compact && action.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {action.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="outline" className={cn("text-[10px] uppercase font-bold", effortColors[action.effortLevel])}>
              {action.effortLevel} effort
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-green-500" />
              <span>{action.impactEstimate} {action.carbonUnit} saved</span>
            </div>
            {action.savingsCurrencyEstimate > 0 && (
              <div className="text-xs text-muted-foreground font-medium">
                • ₹{action.savingsCurrencyEstimate} saved
              </div>
            )}
          </div>
        </div>

        {action.status === 'pending' && (
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={() => onComplete(action._id)}
              className="bg-green-600 hover:bg-green-700 h-8"
            >
              Complete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSkip(action._id)}
              className="h-8 text-xs text-muted-foreground"
            >
              Skip
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActionCard;
