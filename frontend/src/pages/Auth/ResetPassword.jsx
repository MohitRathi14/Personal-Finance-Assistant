import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../api/authService';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!formData.newPassword) {
      setError('Password is required');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!token) {
      setError('Invalid or missing reset token');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword(token, formData.newPassword);
      if (response.success) {
        setSuccess('Password has been reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-primary-500 hover:text-primary-400 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Set new password
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your new password below to reset your account password.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 bg-gray-800 py-8 px-6 shadow-2xl rounded-2xl border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/50 p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <p className="text-sm text-green-500">{success}</p>
                </div>
              </div>
            )}

            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-primary-500 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-primary-500 transition-colors" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-primary-500 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-primary-500 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Reset password
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              <span className="block mb-2">🔒 Your password will be encrypted</span>
              <span className="block">⏰ Token expires in 15 minutes</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;