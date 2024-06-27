import React, { FC } from 'react'
export interface MovieDetails 
{
    Title:string,
    imdbRating:string,
    Year:number
    Poster:string
}
const MovieCard:FC<MovieDetails> = ({Title,imdbRating,Year,Poster}) => {
  return (
    <div className="card  w-[190px] h-[254px] bg-gradient-to-r from-[#00ff75] to-[#3700ff] rounded-[20px] transition-all duration-300 hover:shadow-[0px_0px_30px_1px_rgba(0,255,117,0.30)]">
       
    <div className=" shadow-xl flex flex-col   justify-between w-[190px] h-[254px] bg-[#1a1a1a] transition-all duration-200 hover:scale-98 hover:rounded-[20px]">
    <img src={Poster} alt="" className='h-[254px]' />
     <div className=' relative bottom-24 gap-10 z-10 h-[254px] flex flex-col justify-between'>
        <h1 className='flex content-start'>{Title}</h1>
        <div className='flex flex-row justify-between px-2'>
            <span>{imdbRating}</span>
            <span>{Year}</span>
        </div>
        </div>
        

    </div>
  </div>
  )
}

export default MovieCard