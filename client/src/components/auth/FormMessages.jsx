import React from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FormError = ({ message, className = "" }) => {
  if (!message) return null;

  // Final Fail-safe: Try to parse message if it looks like JSON
  let cleanMessage = message;
  if (typeof message === 'string' && (message?.startsWith?.('{') || message?.startsWith?.('['))) {
    try {
      const parsed = JSON.parse(message);
      if (Array.isArray(parsed)) {
        cleanMessage = parsed[0]?.message || parsed[0]?.msg || message;
      } else if (typeof parsed === 'object' && parsed !== null) {
        cleanMessage = parsed.message || parsed.msg || message;
      }
    } catch (e) {
      // Keep original message if parsing fails
    }
  } else if (Array.isArray(message)) {
    cleanMessage = message[0]?.message || message[0]?.msg || JSON.stringify(message);
  }

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1",
      className
    )}>
      <AlertCircle className="h-4 w-4" />
      <span>{cleanMessage}</span>
    </div>
  );
};

export const FormSuccess = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-100 dark:border-green-900/50 animate-in fade-in zoom-in-95",
      className
    )}>
      <CheckCircle2 className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};
