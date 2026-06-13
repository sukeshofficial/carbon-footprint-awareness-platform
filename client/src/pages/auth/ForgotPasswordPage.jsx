import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormError } from '../../components/auth/FormMessages';
import { Loader2, ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setIsSent(true);
      toast.success('Check your email', {
        description: 'If an account exists, we have sent a reset link.',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      const serverErr = error.response?.data;
      const errorMessage = serverErr?.errors?.[0]?.message || serverErr?.message || 'Could not process request.';
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isSent ? "Check your email" : "Reset password"}
      subtitle={isSent
        ? "Recovery instructions sent successfully"
        : "Get back into the ACo2 ecosystem"}
    >
      <div className="space-y-6">
        {!isSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-mono-tight text-[10px] text-zinc-400 font-bold ml-1">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className={cn(
                    "h-12 pl-11 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 transition-all font-medium text-base",
                    "focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30",
                    errors.email && "border-destructive/30 bg-destructive/5 dark:bg-destructive/10"
                  )}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <FormError message={errors.email.message} className="ml-1" />}
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
                  <span>SEND RESET LINK</span>
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
            <div className="bg-green-50 dark:bg-green-500/10 p-6 rounded-[2rem] border border-green-100 dark:border-green-500/20 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-lg shadow-green-500/10 border border-green-100 dark:border-zinc-800 flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-extrabold text-green-950 dark:text-zinc-50 mb-2">Link Sent!</h3>
              <p className="text-xs font-medium text-green-700/60 dark:text-green-400/80 leading-relaxed max-w-xs">
                We've sent a recovery link to your inbox. Please check your spam if you don't see it.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 rounded-full font-bold border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                onClick={() => setIsSent(false)}
              >
                RESEND LINK
              </Button>
              <Link to="/login" className="block text-center">
                <span className="font-mono-tight text-[10px] font-bold text-zinc-400 hover:text-green-600 transition-colors">
                  Back to Sign in
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
