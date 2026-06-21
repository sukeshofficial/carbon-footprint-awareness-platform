import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Bug,
  ShieldCheck,
  Settings,
  Activity,
  Copy
} from 'lucide-react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/utils';

const MetricCard = ({ icon: Icon, label, value, colorClass }) => (
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-1.5 w-full sm:w-[130px] lg:w-[150px] transition-all hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700"
  >
    <div className={cn("p-1.5 rounded-lg", colorClass)}>
      <Icon size={16} />
    </div>
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
        {label}
      </span>
      <span className="text-sm font-black text-zinc-900 dark:text-zinc-50">
        {value}
      </span>
    </div>
  </motion.div>
);

MetricCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  colorClass: PropTypes.string.isRequired,
};

const DashboardFooter = () => {
  const metrics = [
    {
      icon: CheckCircle2,
      label: 'Quality Gate',
      value: 'Passed ✅',
      colorClass: 'text-emerald-500'
    },
    {
      icon: Bug,
      label: 'Open Issues',
      value: '0',
      colorClass: 'text-orange-500'
    },
    {
      icon: ShieldCheck,
      label: 'Security',
      value: 'Rating A',
      colorClass: 'text-indigo-500'
    },
    {
      icon: Activity,
      label: 'Reliability',
      value: 'Rating A',
      colorClass: 'text-blue-500'
    },
    {
      icon: Settings,
      label: 'Maintainability',
      value: 'Rating A',
      colorClass: 'text-slate-500'
    },
    {
      icon: Copy,
      label: 'Duplications',
      value: '6.3%',
      colorClass: 'text-rose-500'
    },
  ];

  return (
    <footer className="w-full bg-transparent pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className=" flex flex-col items-center text-center">

        {/* Top Section: Branding */}
        <div className="space-y-3 mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent italic"
          >
            Built by SUKESH
          </motion.h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Powered by Gemini • Antigravity Engine
          </p>
        </div>

        {/* Middle Section: Quality Description */}
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
            "Code quality, security, and maintainability are continuously monitored with SonarQube enterprise standards for production stability."
          </p>
        </div>

        {/* Metrics Section: Centered Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20 w-full">
          {metrics.map((m) => (
            <MetricCard
              key={m.label}
              icon={m.icon}
              label={m.label}
              value={m.value}
              colorClass={m.colorClass}
            />
          ))}
        </div>

        {/* Navigation Links */}
        {/* <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-xs font-black text-zinc-400 hover:text-indigo-600 dark:hover:text-zinc-100 uppercase tracking-widest transition-colors italic"
            >
              {link.label}
            </Link>
          ))}
        </nav> */}

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 w-full max-w-xs sm:max-w-md mx-auto">
          <p className="text-[10px] font-bold text-zinc-400 tracking-widest">
            © 2026 ACo2 PLATFORM. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default DashboardFooter;
