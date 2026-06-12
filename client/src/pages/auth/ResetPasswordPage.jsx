import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormError } from '../../components/auth/FormMessages';
import { Loader2, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await resetPassword(token, data.password);
      setIsSuccess(true);
      toast.success('Password Reset Successful', {
        description: 'You can now log in with your new password.',
      });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      const serverErr = error.response?.data;
      const errorMessage = serverErr?.errors?.[0]?.message || serverErr?.message || 'Token is invalid or has expired.';
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isSuccess ? "Password updated" : "Reset Password"}
      subtitle={isSuccess
        ? "Your account security is back on track"
        : "Secure your ACo2 access with a new password"}
    >
      <div className="space-y-6">
        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="password" name="password" className="font-mono-tight text-[10px] text-zinc-400 font-bold ml-1">New Password</Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                {...register('password')}
                className={cn(
                  "h-12 rounded-full bg-zinc-50 border-zinc-100 transition-all",
                  "focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30",
                  errors.password && "border-destructive/30 bg-destructive/5"
                )}
                disabled={isLoading}
              />
              {errors.password && <FormError message={errors.password.message} className="ml-1 text-[10px]" />}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" name="confirmPassword" className="font-mono-tight text-[10px] text-zinc-400 font-bold ml-1">Confirm New Password</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={cn(
                  "h-12 rounded-full bg-zinc-50 border-zinc-100 transition-all",
                  "focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30",
                  errors.confirmPassword && "border-destructive/30 bg-destructive/5"
                )}
                disabled={isLoading}
              />
              {errors.confirmPassword && <FormError message={errors.confirmPassword.message} className="ml-1 text-[10px]" />}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <span>UPDATE PASSWORD</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 font-mono-tight text-[10px] font-bold text-zinc-400 hover:text-green-600 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Sign in
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-lg shadow-green-500/10 border border-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-extrabold text-green-950 mb-2">All set!</h3>
              <p className="text-xs font-medium text-green-700/60 leading-relaxed max-w-xs">
                Your password has been successfully reset. You will be redirected shortly.
              </p>
            </div>

            <Link to="/login" className="block">
              <Button className="h-12 w-full rounded-full bg-green-600 text-white hover:bg-green-700 font-bold shadow-md">
                GO TO SIGN IN
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
