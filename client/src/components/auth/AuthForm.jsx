import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PasswordInput } from './PasswordInput';
import { GoogleButton } from './GoogleButton';
import { motion } from 'framer-motion';

const signupSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * @typedef {Object} AuthFormValues
 * @property {string} [name]
 * @property {string} email
 * @property {string} password
 */

export const AuthForm = ({ type = 'login', onSubmit, isLoading }) => {
  const schema = type === 'signup' ? signupSchema : loginSchema;

  /** @type {import('react-hook-form').UseFormReturn<AuthFormValues>} */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: /** @type {AuthFormValues} */ ({
      name: '',
      email: '',
      password: '',
    }),
  });

  const buttonText = isLoading
    ? 'Processing...'
    : type === 'signup'
    ? 'Sign up'
    : 'Sign in';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col"
    >
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
          {type === 'signup' ? 'Create an account' : 'Welcome back'}
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          {type === 'signup'
            ? 'Enter your details to get started with ACo2'
            : 'Enter your credentials to access your account'}
        </p>
      </div>
      <div className="grid gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {type === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {type === 'login' && (
                <a
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <PasswordInput
              id="password"
              {...register('password')}
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {buttonText}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleButton disabled={isLoading} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground mt-6">
        {type === 'signup' ? (
          <>
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </a>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </a>
          </>
        )}
      </div>
    </motion.div >
  );
};

AuthForm.propTypes = {
  type: PropTypes.oneOf(['login', 'signup']),
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
