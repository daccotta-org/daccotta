import { SignIn, SignUp, SignUpButton } from '@clerk/clerk-react'
import React from 'react'
import { dark } from "@clerk/themes";

const SignUpPage = () => {
  return (
    <>
    <div className='w-[100vw] flex flex-row justify-center mt-10'>
    <SignIn
    appearance={{
      baseTheme: dark
    }}
    path="/sign-up"
    signUpUrl="/sign-up"
  />
    </div>
    </>
  )
}

export default SignUpPage