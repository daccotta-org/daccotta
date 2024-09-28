// import { useState, useEffect } from "react"
// import CarouselCard from "./CarouselCard"
// import { useFriendTopMovies } from "@/services/friendsService"
// import { useMovieList } from "@/services/movieService"
// import { SimpleMovie } from "@/Types/Movie"

// const MovieCarousel = () => {
//     const {
//         data: friendMoviesData,
//         isLoading: isFriendMoviesLoading,
//         error: friendMoviesError,
//     } = useFriendTopMovies()
//     const {
//         data: topMovies,
//         isLoading: isTopMoviesLoading,
//         error: topMoviesError,
//     } = useMovieList("popular", 1)
//     const [carouselMovies, setCarouselMovies] = useState<SimpleMovie[]>([])

//     console.log("friendMoviesData :", friendMoviesData)

//     useEffect(() => {
//         if (friendMoviesData && friendMoviesData.length > 0) {
//             // If we have friend movies, use them
//             const movies = friendMoviesData.flatMap((friendData) =>
//                 friendData.movies.slice(0, 2).map((movie) => ({
//                     ...movie,
//                     friend: friendData.friend,
//                 }))
//             )
//             console.log("movies :", movies)
//             if(movies.length === 0){
//                 if(topMovies){
//                     setCarouselMovies(
//                         topMovies.map((movie) => ({ ...movie, friend: "" }))
//                     )
//                 }
//             }
//             else{
//                 setCarouselMovies(movies)
//             }
//             // setCarouselMovies(movies)
//         } else if (topMovies) {
//             // If no friend movies, use top movies from TMDB
//             setCarouselMovies(
//                 topMovies.map((movie) => ({ ...movie, friend: "" }))
//             )
//         }
//         // if(topMovies && friendMoviesData && friendMoviesData.length > 0 && carouselMovies.length === 0){
//         //     setCarouselMovies(
//         //         topMovies.map((movie) => ({ ...movie, friend: "" }))
//         //     )
//         // }
//     }, [friendMoviesData, topMovies])

//     if (isFriendMoviesLoading || isTopMoviesLoading) {
//         return <div>Loading...</div>
//     }

//     if (friendMoviesError || topMoviesError) {
//         return <div>Error loading movies</div>
//     }

//     return (
//         <div className="carousel w-full">
//             {carouselMovies.map((movie) => (
//                 <CarouselCard
//                     id={movie.id}
//                     key={movie.movie_id}
//                     movie_id={movie.movie_id}
//                     poster_path={movie.poster_path}
//                     backdrop_path={movie.backdrop_path}
//                     friend={movie.friend}
//                     overview={movie.overview}
//                     title={movie.title}
//                     release_date={movie.release_date}
//                     genre_ids={movie.genre_ids}
//                 />
//             ))}
//         </div>
//     )
// }

// export default MovieCarousel

import { useState, useEffect } from "react"
import CarouselCard from "./CarouselCard"
import { useFriendTopMovies } from "@/services/friendsService"
import { useMovieList } from "@/services/movieService"
import { SimpleMovie } from "@/Types/Movie"

const MovieCarousel = () => {
    const {
        data: friendMoviesData,
        isLoading: isFriendMoviesLoading,
        error: friendMoviesError,
    } = useFriendTopMovies()
    const {
        data: topMovies,
        isLoading: isTopMoviesLoading,
        error: topMoviesError,
    } = useMovieList("popular", 1)
    const [carouselMovies, setCarouselMovies] = useState<SimpleMovie[]>([])

    useEffect(() => {
        if (friendMoviesData && friendMoviesData.length > 0) {
            const movies = friendMoviesData.flatMap((friendData) =>
                friendData.movies.slice(0, 2).map((movie) => ({
                    ...movie,
                    friend: friendData.friend,
                }))
            )

            if (movies.length > 0) {
                setCarouselMovies(movies)
            } else if (topMovies) {
                setCarouselMovies(
                    topMovies.map((movie) => ({ ...movie, friend: "" }))
                )
            }
        } else if (topMovies) {
            setCarouselMovies(
                topMovies.map((movie) => ({ ...movie, friend: "" }))
            )
        }
    }, [friendMoviesData, topMovies])

    if (isFriendMoviesLoading || isTopMoviesLoading) {
        return <div>Loading...</div>
    }

    if (friendMoviesError || topMoviesError) {
        return <div>Error loading movies</div>
    }

    return (
        <div className="carousel w-full">
            {carouselMovies.map((movie) => (
                <CarouselCard key={movie.movie_id} {...movie} />
            ))}
        </div>
    )
}

export default MovieCarousel
