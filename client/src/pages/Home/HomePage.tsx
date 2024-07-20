

import MovieCarousel from '../../components/MovieCarousel/MovieCarousel';
import { MovieList } from '../../data/Movies';

const HomePage = () => {
  //fix this import issue
  // const SignInRedirectUrl= import.meta.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL;
  // const SignUpRedirectUrl= import.meta.env.CLERK_SIGN_UP_FORCE_REDIRECT_URL;
  return (
    <>

    <main className='px-8 w-[100vw]'>
   
    <div className='section-1 w-[100vw] p-2 flex flex-col '>
      <h1 className='sm: text-3xl md:text-4xl lg:text-6xl font-bold flex  mt-16 '>Your Social Network For Movies</h1>
      <h1 className=' lg:text-xl mt-6 font-bold '>Top Movies In Your Area</h1>
      <div>
        <MovieCarousel movie={MovieList}/>

      </div>

       
    </div>
    </main>
    </>


  )
}

export default HomePage