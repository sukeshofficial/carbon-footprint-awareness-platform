import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, ChevronRight, User, ShieldCheck, Mail, Calendar } from 'lucide-react';
import { getAllUsers } from '../services/adminService';
import UserDetailsModal from '../components/admin/UserDetailsModal';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const SuperAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users. Please check your permissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-zinc-950/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Users size={24} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-zinc-50 leading-tight">
                Super Admin
              </h1>
            </div>
            <p className="text-muted-foreground text-base">
              Manage and view all registered users across the platform.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 w-full md:w-80">
            <Search className="w-5 h-5 text-zinc-400 ml-2" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium w-full placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Users" value={users.length} icon={Users} color="bg-blue-500" />
          <StatCard title="Active Profiles" value={users.filter(u => u.profile).length} icon={ShieldCheck} color="bg-primary" />
          <StatCard title="Unverified" value={users.filter(u => !u.isVerified).length} icon={Mail} color="bg-amber-500" />
        </div>

        {/* User List */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50">User Directory</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                {filteredUsers.length} Users Found
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">User</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Joined</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8">
                        <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-zinc-50 dark:hover:bg-primary/5 transition-colors group cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <User size={18} className="text-zinc-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-zinc-50 group-hover:text-primary transition-colors">{user.name}</p>
                            <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                          user.role === 'admin' ? "bg-primary/10 text-primary" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", user.isVerified ? "bg-green-500" : "bg-amber-500")} />
                          <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">
                            {user.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-600 transition-colors">
                          <Calendar size={14} />
                          <span className="text-xs font-bold">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-all text-zinc-400 hover:text-primary active:scale-95 shadow-sm border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300">
                          <Users size={32} />
                        </div>
                        <p className="text-sm font-bold text-muted-foreground italic">No users found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-5"
  >
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic leading-none mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-900 dark:text-zinc-50 leading-none">{value}</p>
    </div>
  </motion.div>
);

export default SuperAdminPage;
