import React, { FC } from 'react'
import MovieCard, { MovieDetails } from '../MovieCard/MovieCard'
interface Movies
{
    movie : MovieDetails[]
}

const MovieCarousel:FC<Movies> = ({movie}) => {
  return (
    <div className='flex flex-row flex-wrap gap-4 p-8'>
        {movie.map((mov)=>
            <MovieCard imdbRating={mov.imdbRating} Year={mov.Year} Title={mov.Title} Poster={mov.Poster}/>
            )}
    </div>
  )
}

export default MovieCarousel