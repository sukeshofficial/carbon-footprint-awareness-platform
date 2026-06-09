import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const schema = z.object({
  email: z.string().email('Invalid email address'),
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
    resolver: zodResolver(schema),
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
      const serverError = error.response?.data;
      const errorMessage = serverError?.errors?.[0]?.message || serverError?.message || 'Could not process request. Please try again.';

      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              {isSent
                ? "Check your inbox for a reset link."
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setIsSent(false)}>
                Back to Forgot Password
              </Button>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <a href="/login" className="text-sm text-primary hover:underline">
              Back to Sign in
            </a>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
