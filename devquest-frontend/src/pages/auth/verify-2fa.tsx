// src/pages/auth/verify-2fa.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../../services/authService';

const Verify2FA = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { userId } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || Array.isArray(userId)) {
      setError('Invalid user ID');
      return;
    }

    try {
      const isValid = await authService.verify2FAToken(userId, token);

      if (isValid) {
        router.push('/dashboard');
      } else {
        setError('Invalid verification code');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      setError('An error occurred during verification');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Two-Factor Authentication
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter verification code"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify2FA;