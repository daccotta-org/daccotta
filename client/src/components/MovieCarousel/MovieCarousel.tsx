import React, { FC } from 'react'
import MovieCard, { MovieDetails } from '../MovieCard/MovieCard'
interface Movies
{
    movie : MovieDetails[]
}

const MovieCarousel:FC<Movies> = ({movie}) => {
  return (
    <div className='carousel carousel-end bg-neutral rounded-box w-[100vw] space-x-4 mt-2'>
        {movie.map((mov)=>
            <div className="carousel-item">
            <MovieCard  key={mov.Title} imdbRating={mov.imdbRating} Year={mov.Year} Title={mov.Title} Poster={mov.Poster}/>
            </div>
            )}
    </div>
  )
}

export default MovieCarousel