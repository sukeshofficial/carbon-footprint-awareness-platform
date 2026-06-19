import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { FormError } from '../../components/auth/FormMessages';
import { GoogleButton } from '../../components/auth/GoogleButton';
import { Loader2, User, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { extractServerError } from '../../utils/extractServerError';

const signupSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth_failed') {
      toast.error('Authentication Failed', {
        description: 'Google registration was unsuccessful. Please try again.',
      });
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      // Syncing with existing backend 'name' field
      await signup({
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
      });
      setIsSuccess(true);
      toast.success('Registration successful!', {
        description: 'Please check your email to verify your account.',
      });
    } catch (error) {
      setServerError(extractServerError(error.response?.data, 'An error occurred during registration.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the ACo2 developer ecosystem"
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="h-20 w-20 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-green-100 dark:border-green-500/20">
            <Mail className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Check your email</h3>
            <p className="text-zinc-600 dark:text-zinc-400 font-small">
              We've sent a verification link to your email address. Please click the link to activate your account.
            </p>
          </div>
          <Button
            onClick={() => navigate('/login')}
            className="h-12 w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-2">
              <span>GO TO LOGIN</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Button>
          <p className="text-xs text-zinc-400">
            Didn't receive the email? <button onClick={() => setIsSuccess(false)} className="text-green-600 font-bold hover:underline">Try again</button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="font-mono-tight text-[10px] text-zinc-400 font-bold ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register('name')}
                  className={cn(
                    "h-12 pl-11 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 transition-all font-medium",
                    "focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30",
                    errors.name && "border-destructive/30 bg-destructive/5 dark:bg-destructive/10"
                  )}
                  disabled={isLoading}
                />
              </div>
              {errors.name && <FormError message={errors.name.message} className="ml-1" />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username Field */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="font-mono-tight text-[10px] text-zinc-400 font-bold ml-1">Username</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">@</span>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    {...register('username')}
                    className={cn(
                      "h-12 pl-11 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 transition-all font-medium",
                      "focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30",
                      errors.username && "border-destructive/30 bg-destructive/5 dark:bg-destructive/10"
                    )}
                    disabled={isLoading}
                  />
                </div>
                {errors.username && <FormError message={errors.username.message} className="ml-1 text-[10px]" />}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-mono-tight text-[10px] text-zinc-400 font-bold ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className={cn(
                      "h-12 pl-11 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 transition-all font-medium",
                      "focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30",
                      errors.email && "border-destructive/30 bg-destructive/5 dark:bg-destructive/10"
                    )}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <FormError message={errors.email.message} className="ml-1 text-[10px]" />}
              </div>
            </div>

            {/* Password Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="font-mono-tight text-[10px] text-zinc-400 font-bold ml-1">Password</Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={cn(
                    "h-12 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30",
                    errors.password && "border-destructive/30 bg-destructive/5 dark:bg-destructive/10"
                  )}
                  disabled={isLoading}
                />
                {errors.password && <FormError message={errors.password.message} className="ml-1 text-[10px]" />}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="font-mono-tight text-[10px] text-zinc-400 font-bold ml-1">Confirm</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={cn(
                    "h-12 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30",
                    errors.confirmPassword && "border-destructive/30 bg-destructive/5 dark:bg-destructive/10"
                  )}
                  disabled={isLoading}
                />
                {errors.confirmPassword && <FormError message={errors.confirmPassword.message} className="ml-1 text-[10px]" />}
              </div>
            </div>
          </div>

          {serverError && <FormError message={serverError} className="p-4 rounded-3xl border border-destructive/10 bg-destructive/5 text-xs inline-flex w-full" />}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mt-6">
            <div className="w-full">
              <GoogleButton disabled={isLoading} />
            </div>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white dark:bg-[#131315] font-mono-tight text-[9px] text-zinc-300 dark:text-zinc-500 font-bold">OR CONTINUE WITH</span>
              </div>
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
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>

          <p className="text-center text-xs font-medium text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-bold hover:underline">Sign in</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default SignupPage;
