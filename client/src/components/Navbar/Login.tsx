import { FC } from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { IoLogInOutline } from "react-icons/io5";

const Login:FC = () => {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center tooltip tooltip-right' data-tip="login">
    <SignedIn>
      <UserButton afterSignOutUrl='/' />
    </SignedIn>
    <SignedOut>
      <button><Link to={"/sign-up"}><IoLogInOutline size="54px" />
      </Link></button>
    </SignedOut>
    </div>
  )
}

export default Login