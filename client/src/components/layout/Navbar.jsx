import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../store/profileStore';
import {
  Leaf,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  CalendarCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Action Planner', path: '/planner', icon: CalendarCheck },
    { label: 'Carbon Profile', path: '/profile/edit', icon: Leaf },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="container max-w-[80vw] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">
              ACo<span className="text-primary italic">2</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-1 pl-3 rounded-full border border-border bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-primary/30 transition-all group"
            >
              <div className="hidden sm:block text-right">
                <p className="text-xs font-black text-zinc-900 dark:text-zinc-50 leading-none mb-0.5">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  {profile?.userType?.replace('_', ' ') || 'Member'}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} />
                )}
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isDropdownOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-border rounded-[1.5rem] shadow-2xl p-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-3 py-2 mb-2 border-b border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">Account</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/profile/edit"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group"
                >
                  <Settings size={18} className="transition-transform group-hover:rotate-45" />
                  Profile Settings
                </Link>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 transition-all"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
