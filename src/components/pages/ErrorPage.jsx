import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An error occurred';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-miami-background via-miami-surface to-miami-background">
      <div className="w-full max-w-md p-8 bg-miami-surface/50 backdrop-blur-sm rounded-2xl shadow-2xl text-center border border-miami-pink/10">
        <h1 className="text-2xl font-bold text-miami-coral mb-4">Authentication Error</h1>
        <p className="text-gray-300 mb-6">{errorMessage}</p>
        <Link to="/login" className="inline-block px-6 py-3 bg-gradient-to-r from-miami-pink to-miami-turquoise text-white rounded-xl hover:scale-105 transition-transform duration-200">
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;