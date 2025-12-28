import React, { useState } from 'react';
import {useNavigate, NavLink} from 'react-router-dom'
import useLoginSignup from '../../hooks/useLoginSignup';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const {registerMerchant}=useLoginSignup()
  const navigate=useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
    }
    console.log("user",formData)
    await registerMerchant(formData)
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="name" 
            placeholder="Name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg" 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg" 
            required 
          />
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm Password" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg" 
            required 
          />
          <button 
            type="submit" 
            className="w-full bg-slate-800 text-white p-2 rounded hover:bg-slate-700">
            Sign Up
          </button>
          
           <div className="mt-6 text-center">
                    <p className="text-gray-600">Already a user? <NavLink to="/login" className="text-slate-900 hover:underline">Login</NavLink></p>
                  </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;

