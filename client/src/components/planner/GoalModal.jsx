import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Target, Zap, Flame } from 'lucide-react';
import { cn } from '../../lib/utils';

const TARGET_TYPES = [
  {
    value: 'action_completion_count',
    label: 'Complete Actions',
    description: 'Hit a total number of green actions',
    icon: Zap,
    unit: 'actions',
    placeholder: 'e.g. 10',
  },
  {
    value: 'footprint_reduction_percent',
    label: 'Reduce Footprint',
    description: 'Cut your CO₂ output by a percentage',
    icon: Target,
    unit: '%',
    placeholder: 'e.g. 15',
  },
  {
    value: 'streak_days',
    label: 'Build a Streak',
    description: 'Act consistently for N days in a row',
    icon: Flame,
    unit: 'days',
    placeholder: 'e.g. 21',
  },
];

const GoalModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetType: 'action_completion_count',
    targetValue: '',
  });

  const selected = TARGET_TYPES.find(t => t.value === formData.targetType);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.targetValue) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSubmit({ ...formData, targetValue: Number.parseFloat(formData.targetValue), startDate: new Date().toISOString() }); /* Sonar: S2737 – use Number.parseFloat */
    onClose();
    setFormData({ title: '', description: '', targetType: 'action_completion_count', targetValue: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-[2rem]">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 px-8 pt-8 pb-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-white">New Sustainability Goal</DialogTitle>
              <DialogDescription className="text-white/70 text-xs font-medium mt-0.5">
                Your actions will be scheduled around this goal
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Goal Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Goal Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Reduce my footprint this month"
              value={formData.title}
              onChange={handleChange}
              className="rounded-xl h-12 font-medium border-slate-200 focus:border-primary focus:ring-primary/20"
              autoFocus
            />
          </div>

          {/* Target Type */}
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Goal Type *
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {TARGET_TYPES.map((type) => {
                const Icon = type.icon;
                const isActive = formData.targetType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, targetType: type.value }))}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer",
                      isActive
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-100 bg-white text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-[10px] font-black uppercase tracking-wider leading-tight">{type.label}</span>
                  </button>
                );
              })}
            </div>
            {selected && (
              <p className="text-xs text-muted-foreground font-medium pl-1">{selected.description}</p>
            )}
          </div>

          {/* Target Value */}
          <div className="space-y-2">
            <Label htmlFor="targetValue" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Target Value * <span className="normal-case font-medium">({selected?.unit})</span>
            </Label>
            <Input
              id="targetValue"
              name="targetValue"
              type="number"
              min="1"
              placeholder={selected?.placeholder || 'e.g. 10'}
              value={formData.targetValue}
              onChange={handleChange}
              className="rounded-xl h-12 font-medium border-slate-200 focus:border-primary focus:ring-primary/20"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Notes <span className="normal-case font-medium">(optional)</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Why is this goal important to you?"
              value={formData.description}
              onChange={handleChange}
              className="rounded-xl border-slate-200 min-h-[80px] font-medium resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-full h-12 font-bold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-full h-12 font-bold shadow-lg shadow-primary/20"
            >
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalModal;
