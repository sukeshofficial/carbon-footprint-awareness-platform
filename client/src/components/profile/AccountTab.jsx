import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Camera, User, AtSign, Mail, Lock, ShieldCheck, Loader2, CheckCircle2, Moon, Sun, Monitor, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import api from '../../services/api';

const AccountTab = () => {
  const { user, updateMe, forgotPassword } = useAuth();
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [avatarUrl, setAvatarUrl] = useState(null);   // final Cloudinary URL
  const [uploading, setUploading] = useState(false);  // uploading state
  const [saving, setSaving] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB.');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary via backend now
    setUploading(true);
    try {
      const b64 = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = (ev) => resolve(ev.target.result);
        r.readAsDataURL(file);
      });
      const res = await api.patch('/auth/me', { avatar: b64 });
      setAvatarUrl(res.data.data.user.avatar);
      toast.success('Photo uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
      setAvatarPreview(user?.avatar || null);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else if (file) {
      toast.error('Please drop an image file.');
    }
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    try {
      const res = await api.patch('/auth/me', { avatar: null });
      setAvatarUrl(null);
      setAvatarPreview(null);
      toast.success('Photo removed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove photo.');
      setAvatarPreview(user?.avatar || null);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Full name is required.');
      return;
    }
    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters.');
      return;
    }
    setSaving(true);
    try {
      await updateMe(formData); // avatar already uploaded separately
      toast.success('Account updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    setResetLoading(true);
    try {
      await forgotPassword(user?.email);
      setResetSent(true);
      toast.success('Password reset link sent to your email.');
    } catch {
      toast.error('Could not send reset email. Try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const isGoogleUser = !!(user?.googleId);
  const isChanged =
    formData.name !== (user?.name || '') ||
    formData.username !== (user?.username || '') ||
    formData.bio !== (user?.bio || '');

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary shadow-sm shadow-primary/5">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-black text-foreground dark:text-zinc-50 tracking-tight uppercase leading-none">{title}</h3>
    </div>
  );

  return (
    <div className="space-y-10">

      {/* ── 1. Avatar ── */}
      <section>
        <SectionHeader icon={Camera} title="Profile Photo" />
        <div className='bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-4xl border border-zinc-100 dark:border-zinc-800/50 shadow-sm'>
          <div
            className={cn(
              "flex items-center gap-6 p-4 rounded-2xl border-dashed border-2 transition-all cursor-pointer group",
              isDragging ? "border-primary/20 bg-primary/5 dark:bg-primary/10" : "border-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30",
              uploading && "opacity-80 cursor-wait"
            )}
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="relative">
              <div className={cn(
                "w-20 h-20 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center transition-colors",
                isDragging ? "border-primary/20" : "border-primary/20"
              )}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-8 h-8 text-primary/40" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {uploading ? 'Uploading photo…' : isDragging ? 'Drop to upload' : 'Upload a new photo'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG or WebP · max 5 MB</p>
              <div className="flex items-center gap-3 mt-1">
                {avatarPreview && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (avatarUrl) {
                        // If we just uploaded but haven't saved other changes yet, 
                        // or it was a local preview, just revert to current saved avatar
                        setAvatarUrl(null);
                        setAvatarPreview(user?.avatar || null);
                      } else {
                        // If it's the already saved avatar, remove it from DB
                        handleRemoveAvatar();
                      }
                    }}
                    className="text-xs text-destructive font-semibold hover:underline"
                  >
                    Remove
                  </button>
                )}
                {isGoogleUser && user?.googleAvatar && avatarPreview !== user.googleAvatar && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      setUploading(true);
                      try {
                        const res = await api.patch('/auth/me', { avatar: user.googleAvatar });
                        setAvatarUrl(null); // Clear pending upload since we just saved
                        setAvatarPreview(res.data.data.user.avatar);
                        toast.success('Synced with Google Photo!');
                      } catch (err) {
                        toast.error('Failed to sync Google photo');
                      } finally {
                        setUploading(false);
                      }
                    }}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Use Google Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-zinc-100 dark:border-zinc-800/50" />

      {/* ── 2. Identity ── */}
      <section>
        <SectionHeader icon={User} title="Identity" />
        <div className='bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-4xl border border-zinc-100 dark:border-zinc-800/50 shadow-sm'>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4">
            <div className="grid gap-1.5">
              <Label htmlFor="account-name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="account-name"
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="Your display name"
                className="h-10 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="account-username">Username <span className="text-destructive">*</span></Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="account-username"
                  value={formData.username}
                  onChange={e => setFormData(p => ({ ...p, username: e.target.value.toLowerCase().replace(/\s/g, '') }))}
                  placeholder="yourhandle"
                  className="h-10 pl-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="account-bio">Bio <span className="text-muted-foreground text-[10px] font-normal">(optional)</span></Label>
              <textarea
                id="account-bio"
                value={formData.bio}
                onChange={e => setFormData(p => ({ ...p, bio: e.target.value.slice(0, 280) }))}
                placeholder="A short line about yourself…"
                rows={3}
                className="flex w-full rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-3 py-2 text-sm resize-none focus-visible:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground font-medium"
              />
              <p className="text-[10px] text-muted-foreground text-right">{formData.bio.length}/280</p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-zinc-100 dark:border-zinc-800/50" />

      {/* ── 3. Email ── */}
      <section>
        <SectionHeader icon={Mail} title="Email Address" />
        <div className='bg-zinc-50 dark:bg-zinc-950/40 p-8 rounded-4xl border border-zinc-100 dark:border-zinc-800/50 shadow-sm'>
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <div className="relative">
              <Input value={user?.email || ''} readOnly className="h-10 pr-24 bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 cursor-not-allowed text-muted-foreground font-medium" />
              <span className={cn(
                'absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full',
                user?.isVerified
                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
              )}>
                {user?.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">Email cannot be changed here. Contact support if needed.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-zinc-100 dark:border-zinc-800/50" />

      {/* ── 4. Security ── */}
      <section>
        <SectionHeader icon={Lock} title="Password & Security" />
        {isGoogleUser ? (
          <div className="flex items-start gap-4 p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/50 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Google account linked</p>
              <p className="text-xs text-muted-foreground mt-0.5">You signed in with Google. Password login is not available for this account.</p>
            </div>
          </div>
        ) : resetSent ? (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Reset link sent</p>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400 mt-0.5">Check your inbox at <strong>{user?.email}</strong> and follow the link to set a new password.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-950/40 shadow-sm">
            <div>
              <p className="text-sm font-black text-foreground dark:text-zinc-50 italic">Change your password</p>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium italic">We'll send a secure reset link to <strong>{user?.email}</strong>.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePasswordReset}
              disabled={resetLoading}
              className="shrink-0 gap-2 font-semibold"
            >
              {resetLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Send Reset Link
            </Button>
          </div>
        )}
      </section>

      <div className="border-t border-zinc-100 dark:border-zinc-800/50" />

      {/* ── 5. Appearance ── */}
      <section>
        <SectionHeader icon={Palette} title="Appearance" />
        <div className='bg-zinc-50 dark:bg-zinc-950/40 p-6 rounded-4xl border border-zinc-100 dark:border-zinc-800/50 shadow-sm'>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-4 rounded-3xl border-2 transition-all relative overflow-hidden",
                  theme === t.id
                    ? "border-primary bg-white dark:bg-zinc-900 shadow-xl shadow-primary/10"
                    : "border-transparent bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-muted-foreground"
                )}
              >
                {theme === t.id && (
                  <div className="absolute top-0 right-0 p-1.5 bg-primary text-white rounded-bl-xl">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  </div>
                )}
                <div className={cn(
                  "p-2.5 rounded-xl transition-all",
                  theme === t.id ? "bg-primary/20 text-primary scale-110" : "bg-zinc-200/50 dark:bg-zinc-800/50"
                )}>
                  <t.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold tracking-tight">{t.label}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-4 text-center">
            Choose how you'd like your carbon dashboard to look.
          </p>
        </div>
      </section>

      {/* ── Save ── */}
      <div className="pt-2">
        <Button
          onClick={handleSave}
          disabled={saving || !isChanged}
          className="w-full sm:w-auto gap-2 font-bold h-11 px-8"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving…' : 'Save Account Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AccountTab;
