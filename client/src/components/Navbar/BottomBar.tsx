import { FC } from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { IoLogInOutline } from "react-icons/io5";
import ThemeController from './ThemeController';

const Bottom:FC = () => {
  return (
    <>
      <SignedIn>
    <div className=' p-2 h-full w-full flex flex-col items-center justify-start gap-4 ' >
        
      <UserButton afterSignOutUrl='/' />
      <ThemeController/>
    </div>
      </SignedIn>
      <SignedOut>
        <IoLogInOutline/>
      </SignedOut>
    </>
  )
}

export default Bottom