import React from 'react'
import {

    SignedIn,
    SignIn,
    SignUp,
    UserButton,
    SignInButton,
    SignUpButton
  } from "@clerk/clerk-react";
import Navbar from '../../components/Navbar/Navbar';
import MovieCarousel from '../../components/MovieCarousel/MovieCarousel';
import { MovieList } from '../../data/Movies';
const HomePage = () => {
    //fix this import issue
    const SignInRedirectUrl= import.meta.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL;
    const SignUpRedirectUrl= import.meta.env.CLERK_SIGN_UP_FORCE_REDIRECT_URL;
  return (
    <>
    <main>
   
    <div className='section-1 w-[100vw]'>
      <h1 className='text-6xl font-bold flex justify-center mt-16 '>Your Social Network For Movies</h1>
      <h1>Top Movies In Your Area</h1>
      <div>
        <MovieCarousel movie={MovieList}/>

      </div>

       
    </div>
    </main>
    </>
    
    
  )
}

export default HomePage