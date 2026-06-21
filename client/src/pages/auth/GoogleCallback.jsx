import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (token) {
      localStorage.setItem('accessToken', token);

      // Fetch user data to confirm auth
      api.get('/auth/me')
        .then(() => {
          toast.success('Login Successful', {
            description: 'Redirecting to your dashboard...',
          });
          navigate('/', { replace: true });
        })
        .catch(() => {
          toast.error('Authentication Error', {
            description: 'Failed to verify account.',
          });
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-4 text-lg font-medium">Completing authentication...</p>
    </div>
  );
};

export default GoogleCallback;
