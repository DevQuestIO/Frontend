import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5002/api/auth/login', {  // API endpoint in the backend repo
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError('Invalid credentials');
      } else {
        const data = await res.json();
        // Handle successful login (store token, etc.)
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex justify-center items-center">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">Login</h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-700"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-700"
            />
          </div>

          {/* Display error messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </form>

        {/* Link to registration page */}
        <div className="mt-4 text-center text-sm text-gray-300">
          <p>Don’t have an account? <Link href="/auth/register" className="text-blue-600 hover:text-blue-500">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
