import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Calendar, MapPin, Briefcase, Home, ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto border border-zinc-200 dark:border-zinc-800"
            >
              {/* Header */}
              <div className="relative h-32 bg-primary/10 flex items-center px-8 border-b border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-6 mt-12">
                  <div className="w-24 h-24 rounded-3xl bg-white dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-zinc-400" />
                    )}
                  </div>
                  <div className="pt-4">
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{user.name}</h2>
                    <p className="text-sm font-bold text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Account Details */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary italic">Account Information</h3>
                    <div className="space-y-4">
                      <DetailItem icon={Mail} label="Email" value={user.email} />
                      <DetailItem icon={Calendar} label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
                      <DetailItem
                        icon={user.role === 'admin' ? ShieldCheck : User}
                        label="Role"
                        value={user.role.toUpperCase()}
                        className={user.role === 'admin' ? 'text-primary' : ''}
                      />
                      <DetailItem
                        icon={user.isVerified ? ShieldCheck : ShieldAlert}
                        label="Status"
                        value={user.isVerified ? 'Verified' : 'Unverified'}
                        className={user.isVerified ? 'text-green-600' : 'text-amber-600'}
                      />
                    </div>
                  </div>

                  {/* Right Column: Profile Details */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary italic">Profile Context</h3>
                    {user.profile ? (
                      <div className="space-y-4">
                        <DetailItem icon={MapPin} label="Region" value={user.profile.cityRegion || 'N/A'} />
                        <DetailItem icon={Briefcase} label="Type" value={user.profile.userType?.replace('_', ' ') || 'N/A'} />
                        <DetailItem icon={Home} label="Household" value={user.profile.householdType?.replace('_', ' ') || 'N/A'} />
                        <div className="pt-2">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Completeness Score</p>
                          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${user.profile.profileCompletenessScore || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700">
                        <p className="text-sm font-bold text-muted-foreground text-center italic">No profile data available yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const DetailItem = ({ icon: Icon, label, value, className = '' }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">{label}</p>
      <p className={cn("text-sm font-bold text-zinc-900 dark:text-zinc-100 break-all", className)}>{value}</p>
    </div>
  </div>
);

export default UserDetailsModal;
