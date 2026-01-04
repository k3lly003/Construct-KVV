import React, { useState, FormEventHandler } from 'react';

interface LoginCardProps {
  onSubmit: (email: string, password: string) => void;
  onGoogleSignIn: () => void;
  onAppleSignIn: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onSubmit, onGoogleSignIn, onAppleSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h3 className="text-mid font-semibold mb-4">Login</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 text-small font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 text-small font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign In
        </button>
      </form>
      <div className="mt-4">
        <button
          onClick={onGoogleSignIn}
          className="flex items-center justify-center w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {/* Add Google Icon here */}
          Sign in with Google
        </button>
        <button
          onClick={onAppleSignIn}
          className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
        >
          {/* Add Apple Icon here */}
          Sign in with Apple
        </button>
      </div>
    </div>
  );
};