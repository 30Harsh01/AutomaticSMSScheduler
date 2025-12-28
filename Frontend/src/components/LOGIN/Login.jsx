import React, { useState } from 'react';
import {useNavigate, NavLink} from 'react-router-dom'
import useLoginSignup from '../../hooks/useLoginSignup';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate()
  const {registerMerchant,loginMerchant}=useLoginSignup()

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Login details:', { email, password });
    await loginMerchant(email,password)
    // navigate('/')

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white p-2 rounded hover:bg-slate-700"
          >
            Login
          </button>
          <div className="mt-6 text-center">
          <p className="text-gray-600">Not a user? <NavLink to="/signup" className="text-slate-900 hover:underline">Sign Up</NavLink></p>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
