import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
      const idToken = hashParams.get('id_token');
      const errorParam = hashParams.get('error');

      if (errorParam) {
        setError('Authentication failed. Please try again.');
        return;
      }

      if (!idToken) {
        setError('No ID token received.');
        return;
      }

      try {
        const payload = idToken.split('.')[1];
        if (!payload) {
          throw new Error('Invalid ID token');
        }

        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
        const json = atob(padded);
        const claims = JSON.parse(json) as {
          name?: string;
          email?: string;
          picture?: string;
          sub?: string;
        };

        const googleInfo = {
          name: claims.name,
          email: claims.email,
          picture: claims.picture,
          sub: claims.sub,
        };

        console.log('Google user info:', googleInfo);
        setStatus('success');
        setTimeout(() => navigate('/dashboard', { replace: true }), 800);
      } catch (err) {
        setError('Failed to parse Google user info.');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          {error ? (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {error ? 'Authentication Failed' : status === 'success' ? 'Signed In' : 'Completing Sign In...'}
        </h2>
        <p className="text-neutral-400">
          {error || (status === 'success' ? 'Check the console for Google user info.' : 'Please wait while we sign you in')}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
