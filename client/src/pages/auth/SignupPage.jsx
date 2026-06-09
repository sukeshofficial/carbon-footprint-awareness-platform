import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../../components/auth/AuthForm';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (data) => {
    setIsLoading(true);
    try {
      await signup(data);
      toast.success('Account created!', {
        description: 'Please log in with your new credentials.',
      });
      navigate('/login');
    } catch (error) {
      const serverError = error.response?.data;
      const errorMessage = serverError?.errors?.[0]?.message || serverError?.message || 'Something went wrong.';

      toast.error('Signup Failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <AuthForm type="signup" onSubmit={handleSignup} isLoading={isLoading} />
    </div>
  );
};

export default SignupPage;
