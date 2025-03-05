import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function Welcome() {
  const [name, setName] = useState('');
  const naviagte = useNavigate();
 const {user} = useUser();





  const savingName = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://notyet-dep.vercel.app/api/savinguser', { name, clerkUserId: user.id });
      if (res.status === 201) {
        console.log('User saved successfully');
         naviagte('/talktome');
      } else {
        console.error('Failed to save user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 m-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <form className="space-y-6" onSubmit={savingName}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
            <p className="text-gray-600 mt-2">Let's get to know each other</p>
          </div>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What's your name?"
            className="w-full px-4 py-3 border-b-2 border-gray-300 focus:ring-2 focus:ring-indigo-200 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-900 text-white py-3 rounded-lg hover:bg-indigo-950 transition-colors font-medium"
          >
            Save my name
          </button>
        </form>
      </div>
    </div>
  );
}