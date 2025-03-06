import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function Welcome() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { user } = useUser();

  // Check if the user already exists
  useEffect(() => {
    if (!user) return;

    const checkUserExists = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/check-user/${user.id}`);
        if (res.data.exists) {
          // User already exists, redirect to TalkToMe page
          navigate('/talktome');
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };

    checkUserExists();
  }, [user, navigate]);

  const savingName = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/savinguser', {
        name,
        clerkUserId: user.id,
      });
      if (res.status === 201) {
        console.log('User saved successfully');
        navigate('/talktome');
      } else {
        console.error('Failed to save user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center my-44 lg:p-4 lg:m-8 max-h-screen">
      <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
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
            className="w-full text-neutral-content bg-neutral py-3 rounded-lg hover:bg-indigo-950 transition-colors font-medium"
          >
            Save my name
          </button>
        </form>
      </div>
    </div>
  );
}