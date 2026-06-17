/**
 * SavingsBadge.jsx
 */

import React from 'react';
import { IndianRupee } from 'lucide-react';

export default function SavingsBadge({ amount }) {
  if (!amount || amount <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
      <IndianRupee className="w-3 h-3" />
      ~₹{amount.toLocaleString('en-IN')}/mo saved
    </span>
  );
}
