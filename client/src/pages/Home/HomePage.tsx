import React from 'react'
import {

    SignedIn,
    SignIn,
    SignUp,
    UserButton,
    SignInButton,
    SignUpButton
  } from "@clerk/clerk-react";
const HomePage = () => {
    //fix this import issue
    const SignInRedirectUrl= import.meta.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL;
    const SignUpRedirectUrl= import.meta.env.CLERK_SIGN_UP_FORCE_REDIRECT_URL;
  return (
    <>
    <div>HomePage</div>
    <div className='flex flex-row gap-4'>
        <SignInButton forceRedirectUrl={"/Profile"}/>
        <SignUpButton forceRedirectUrl={"/Profile"}/>
    </div>
    </>
    
    
  )
}

export default HomePage