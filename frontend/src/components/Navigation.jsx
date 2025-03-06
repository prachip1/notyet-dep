import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

export default function Navigation() {
  const {user} = useUser();
    const navigate= useNavigate();
  return (
    
      <div className='flex justify-between items-center py-4 px-8 text-neutral'>
        <button className="text-xl text-base-content font-extrabold tracking-tighter" onClick={()=>navigate('/')} >
          <span className='text-2xl text-gray-950'> 🐼 </span>NotYet</button>
        <div className='flex space-x-4 text-secondary-content text-sm'>
        {/** <button className="text-neutral font-medium text-base rounded-md p-2 hover:p-2 hover:rounded-lg hover:bg-neutral-content"  onClick={()=>navigate('/signin')}>Sign In</button>*/}
       
       {!user && 
        <button className="bg-base-content text-base-100 
        font-medium  rounded-3xl py-2 px-4 hover:bg-accent hover:text-neutral transition delay-300 duration-300 ease-in-out hover:scale-105"  
        onClick={()=>navigate('/signup')}>Let's Talk</button>
       
       }
      {user && <p className='flex items-center font-manrope'>Welcome</p>}
        <div className=''>  
      <SignedOut>
          <li 
            onClick={() => navigate('/signin')}
            className="text-base-content border border-base-content font-medium 
            rounded-3xl py-2 px-4 hover:scale-105 cursor-pointer list-none 
            focus:outline-2 focus:outline-offset-2 focus:outline-base-content active:bg-base-100 transition delay-300 duration-300 ease-in-out"
          >
            Sign In
          </li>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn></div>
        </div>
      
      </div>
    
  )
}
