import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

export default function Navigation() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  // Check if the current route is "/welcome"
  const isWelcomePage = location.pathname === '/welcome';

  return (
    <div className="flex justify-between items-center py-4 px-8 text-neutral">
      <button
        className="text-xl text-base-content font-extrabold tracking-tighter"
        onClick={() => navigate('/')}
      >
        <span className="text-2xl text-gray-950"> 🐼 </span>NotYet
      </button>
      <div className="flex space-x-4 text-secondary-content text-sm">
        {/* Conditionally render the "Talk to me" button */}
        {user && !isWelcomePage && (
          <button
            className="text-neutral-content bg-neutral border border-base-content font-medium 
            rounded-3xl py-2 px-4 hover:scale-105 cursor-pointer list-none 
            focus:outline-2 focus:outline-offset-2 focus:outline-base-content 
            active:bg-base-100 transition delay-300 duration-300 ease-in-out"
            onClick={() => navigate('/talktome')}
          >
            Talk to me
          </button>
        )}

        {user && <p className="flex items-center font-manrope">Welcome</p>}

        <div>
          <SignedOut>
            <li
              onClick={() => navigate('/signin')}
              className="text-neutral-content bg-neutral border border-base-content font-medium 
              rounded-3xl py-2 px-4 hover:scale-105 cursor-pointer list-none 
              focus:outline-2 focus:outline-offset-2 focus:outline-base-content 
              active:bg-base-100 transition delay-300 duration-300 ease-in-out"
            >
              Sign In
            </li>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}