import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <SignUp />
    </div>
  )
}
