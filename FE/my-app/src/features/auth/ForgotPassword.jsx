import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email input, 2: Code input
  const [formData, setFormData] = useState({ email: '', code: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    return newErrors;
  };

  const validateCode = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = 'Verification code is required';
    else if (!/^\d{6}$/.test(formData.code)) newErrors.code = 'Code must be 6 digits';
    return newErrors;
  };

  const sendVerificationCode = async (e) => {
    e.preventDefault();
    const validationErrors = validateEmail();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      console.log(`Sending verification code to ${formData.email}`);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
        setErrors({});
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setErrors({ submit: error.message || 'Failed to send verification code. Try again.' });
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    const validationErrors = validateCode();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      console.log(`Verifying code ${formData.code} for ${formData.email}`);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setErrors({ submit: error.message || 'Invalid verification code. Try again.' });
    }
  };

  const handleContinueWith = () => {
    console.log('Continue with Google');
    // Placeholder for Google OAuth login - replace with actual implementation
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl transform transition-all hover:scale-105 perspective-1000 rotate-x-2 rotate-y-2">
        <div className="flex justify-center">
          <svg className="w-12 h-12 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17" />
            <path d="M2 12L12 17L22 12" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {step === 1 ? 'Forgot Password' : 'Enter Verification Code'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1
            ? 'Enter your email to receive a verification code.'
            : 'Check your email and enter the code below.'}{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Back to Login</Link>
        </p>
        <form className="mt-8 space-y-6" onSubmit={step === 1 ? sendVerificationCode : verifyCode}>
          {errors.submit && (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
          {step === 1 ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-2 border-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 transition-all hover:shadow-md"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          ) : (
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Verification Code</label>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={formData.code}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-2 border-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 transition-all hover:shadow-md"
              />
              {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-all transform hover:scale-105"
          >
            {isLoading ? 'Processing...' : step === 1 ? 'Send Code' : 'Verify Code'}
          </button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleContinueWith}
              className="inline-flex items-center justify-center w-2/3 py-3 px-4 rounded-lg bg-white text-gray-700 font-semibold shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;