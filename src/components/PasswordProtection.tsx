import { useState } from 'react';

interface PasswordProtectionProps {
  onAuthenticate: () => void;
}

export default function PasswordProtection({ onAuthenticate }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'forbella') {
      onAuthenticate();
      // Store authentication in localStorage
      localStorage.setItem('ramscal_authenticated', 'true');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 to-pink-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-pink-500 mb-6 text-center">
          Ramsee&apos;s Calendar
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-pink-400 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Enter password"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition-colors"
          >
            Enter Calendar
          </button>
        </form>
      </div>
    </div>
  );
} 