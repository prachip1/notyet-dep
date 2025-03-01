import React from 'react'
import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <SignIn />
    </div>
  )
}
