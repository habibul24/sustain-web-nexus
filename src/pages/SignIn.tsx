import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import { LoginForm } from '@/components/auth/LoginForm';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Welcome Back</h1>
            <p className="text-gray-600 text-center">
              Sign in to your SustainTech account to continue your sustainability journey
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/sign-up" 
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SignIn;
