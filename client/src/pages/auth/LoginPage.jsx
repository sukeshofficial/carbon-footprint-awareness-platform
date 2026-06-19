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
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '../../components/ui/checkbox';
import { extractServerError } from '../../utils/extractServerError';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth_failed') {
      toast.error('Authentication Failed', {
        description: 'Google login was unsuccessful. Please try again.',
      });
    }
  }, [searchParams]);

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await login(data.email, data.password, data.rememberMe);
      toast.success('Welcome back!', {
        description: 'You have been successfully logged in.',
      });
      navigate('/');
    } catch (error) {
      setServerError(extractServerError(error.response?.data, 'Invalid credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue building with ACo2"
    >
      <div className="space-y-6">
        {/* Social Authentication Top Area */}
        <div className="w-full">
          <GoogleButton disabled={isLoading} />
        </div>

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-100 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white dark:bg-[#131315] font-mono-tight text-[9px] text-zinc-300 dark:text-zinc-500 font-bold">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* Main Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-mono-tight text-[10px] text-zinc-400 font-bold ml-1">Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                placeholder="sukes_h2006_dev"
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="font-mono-tight text-[10px] text-zinc-400 font-bold">Password</Label>
              <Link
                to="/forgot-password"
                className="font-mono-tight text-[9px] font-bold text-zinc-400 hover:text-green-600 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              {...register('password')}
              className={cn(
                "h-12 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 transition-all",
                "focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30",
                errors.password && "border-destructive/30 bg-destructive/5 dark:bg-destructive/10"
              )}
              disabled={isLoading}
            />
            {errors.password && <FormError message={errors.password.message} className="ml-1" />}
          </div>

          <div className="flex items-center space-x-2 ml-1">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setValue('rememberMe', checked)}
              className="h-4 w-4 rounded-md border-zinc-300 text-green-600 focus:ring-green-500"
            />
            <label
              htmlFor="rememberMe"
              className="font-mono-tight text-[10px] font-bold text-zinc-400 uppercase leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me for 30 days
            </label>
          </div>

          {serverError && <FormError message={serverError} className="p-4 rounded-3xl border border-destructive/10 bg-destructive/5 text-xs inline-flex w-full" />}

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <span>SIGN IN</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </Button>
        </form>

        <p className="text-center text-xs font-medium text-zinc-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-600 font-bold hover:underline">Create account</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
