import { SignIn  } from '@clerk/clerk-react'

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