import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../lib/planningCenter';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      console.log('Code:', code);
      const error = params.get('error');

      if (code) {
        try {
          await handleOAuthCallback(code);
          navigate('/dashboard');
        } catch (err) {
          console.error('Auth error:', err);
          navigate('/', { state: { error: 'Authentication failed' } });
        }
      } else if (error) {
        console.error('Authentication was denied');
        navigate('/', { state: { error: 'Authentication was denied' } });
      } else {
        console.error('No code or error found in URL');
        navigate('/');
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Authentication
        </h2>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
}