import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/button';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`);

        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully.');
        toast.success('Account Activated!', {
          description: 'Your email has been verified. You can now log in.',
        });
      } catch (error) {
        setStatus('error');
        const serverErr = error.response?.data;
        setMessage(serverErr?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [token]);

  return (
    <AuthLayout
      title="Account Activation"
      subtitle="Verifying your ACo2 account"
    >
      <div className="flex flex-col items-center justify-center space-y-8 py-8 text-center">
        {status === 'verifying' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative h-20 w-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-green-100" />
              <div className="absolute inset-0 rounded-full border-4 border-green-600 border-t-transparent animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900">Validating Token</h3>
              <p className="text-zinc-500 text-sm">Please wait while we activate your account...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border-2 border-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-zinc-900">Success!</h3>
              <p className="text-zinc-600 font-medium">{message}</p>
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
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-20 w-20 bg-destructive/5 rounded-full flex items-center justify-center mx-auto border-2 border-destructive/10">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-zinc-900">Verification Failed</h3>
              <p className="text-destructive font-medium">{message}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => navigate('/signup')}
                className="h-12 w-full rounded-full border-zinc-200 font-bold text-sm hover:bg-zinc-50 transition-all"
              >
                BACK TO SIGNUP
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="h-10 w-full text-zinc-500 font-bold text-[10px] hover:text-green-600 transition-colors uppercase font-mono-tight"
              >
                Go to Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
