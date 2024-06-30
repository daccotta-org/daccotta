

const HomePage = () => {
  //fix this import issue
  // const SignInRedirectUrl= import.meta.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL;
  // const SignUpRedirectUrl= import.meta.env.CLERK_SIGN_UP_FORCE_REDIRECT_URL;
  return (
    <>
      <main className="relative justify-center">
        <img className=" xs:hidden md:visible absolute -z-10 opacity-0 md:opacity-35 mt-0 md:-mt-36 "
          src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="" />

        <img
         className="xs:visible sm:visible md:hidden absolute -z-10 opacity-35 mt-0 md:-mt-36"
         src="https://images.unsplash.com/photo-1625888343997-4af8e5d885dc?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" 
         />

        <div className=' absolute section-1 w-[100%]'>
          {/* Your Social Network For Movies */}
          <div className="md:ml-16 flex flex-col mt-56">
            <h1 className=' text-xl md:text-6xl ml-3 text-center md:text-start font-bold flex align-middle '>
              Coming Soon
            </h1>
            <p className="mt-2 ml-3">Your Social Network For Movies</p>
          </div>

          {/* <SignedIn>
             <button className="btn btn-secondary"> Explore</button>
           </SignedIn>
           <SignedOut>
             <button className="btn btn-secondary"><GetStarted/></button>
           </SignedOut> */}

        </div>
      </main>
    </>


  )
}

export default HomePage