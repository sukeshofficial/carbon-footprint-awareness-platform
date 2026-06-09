import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from '../../components/auth/AuthForm';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!', {
        description: 'You have signed in successfully.',
      });
      navigate(from, { replace: true });
    } catch (error) {
      const serverError = error.response?.data;
      const errorMessage = serverError?.errors?.[0]?.message || serverError?.message || 'Invalid email or password.';

      toast.error('Login Failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
    </div>
  );
};

export default LoginPage;
