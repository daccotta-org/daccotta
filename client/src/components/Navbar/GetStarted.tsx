import React, { FC } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const GetStarted:FC = () => {
  return (
    <div>
    <SignedIn>
      <UserButton afterSignOutUrl='/' />
    </SignedIn>
    <SignedOut>
      <button><Link to={"/sign-up"}>Get Started</Link></button>
    </SignedOut>
    </div>
  )
}

export default GetStarted