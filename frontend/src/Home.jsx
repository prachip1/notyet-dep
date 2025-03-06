import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col justify-between items-center p-4 lg:mt-0 lg:px-44 lg:py-8 
    lg:flex-row lg:h-full gap-2 '>
      <div className='w-1/2 mt-28 hidden lg:block '>
        <img src="gen3cover.jpg" alt="cover" className='w-[30rem] h-[30rem] -mt-8 rounded-2xl' />
      </div>
      <div className='flex flex-col gap-6 lg:w-1/2 mt-28'>
      <h2 className="text-7xl font-semibold leading-xl/7">Today is not the day for your panic.</h2> 
   
        <h3 className='text-xl text-gray-700'>A Voice Assistant friend for your anxiety.</h3>
        <button
          className='text-xl font-medium tracking-tight text-gray-800 bg-accent border border-gray-950 py-2 px-4 rounded-3xl w-36'
          onClick={() => navigate('/signup')}
        >
          Let's Talk!
        </button>
      </div>
    </div>
  );
}
