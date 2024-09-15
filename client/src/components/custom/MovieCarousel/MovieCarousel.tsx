// import CarouselCard, { SimpleMovie } from "./CarouselCard"

// const MovieData: SimpleMovie[] = [
//     {
//         movie_id: "49026",
//         backdrop_path: "/c3OHQncTAnKFhdOTX7D3LTW6son.jpg",
//         friend: "siddharth",
//         title: "The Dark Knight",
//         overview:
//             "Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent's crimes to protect the late attorney's reputation and is subsequently hunted by the Gotham City Police Department. Eight years later, Batman encounters the mysterious Selina Kyle and the villainous Bane, a new terrorist leader who overwhelms Gotham's finest. The Dark Knight resurfaces to protect a city that has branded him an enemy.",
//         poster_path: "/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
//         release_date: "2002-12-01",
//     },
//     {
//         movie_id: "49027",
//         backdrop_path: "/c3OHQncTAnKFhdOTX7D3LTW6son.jpg",
//         friend: "ashu",
//         title: "Don Jon",
//         overview:
//             "A New Jersey guy dedicated to his family, friends, and church, develops unrealistic expectations from watching porn and works to find happiness and intimacy with his potential true love.",
//         poster_path: "/uh8bwvgGXeUKzdL4oSul9zxyTcd.jpg",
//         release_date: "2002-12-01",
//     },
//     {
//         movie_id: "138697",
//         backdrop_path: "/4QBI1pdjr2hH1fgC8NqwZZnWNso.jpg",
//         friend: "ashu",
//         title: "The Dark Knight Rises",
//         overview:
//             "Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent's crimes to protect the late attorney's reputation and is subsequently hunted by the Gotham City Police Department. Eight years later, Batman encounters the mysterious Selina Kyle and the villainous Bane, a new terrorist leader who overwhelms Gotham's finest. The Dark Knight resurfaces to protect a city that has branded him an enemy.",
//         poster_path: "/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
//         release_date: "2013-09-12",
//     },
// ]

// const MovieCarousel = () => {
//     return (
//         <div className="carousel  w-full">
//             {MovieData.map((movie) => (
//                 <CarouselCard
//                     key={movie.movie_id}
//                     movie_id={movie.movie_id}
//                     poster_path={movie.poster_path}
//                     backdrop_path={movie.backdrop_path}
//                     friend={movie.friend}
//                     overview={movie.overview}
//                     title={movie.title}
//                     release_date={movie.release_date}
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
            // If we have friend movies, use them
            const movies = friendMoviesData.flatMap((friendData) =>
                friendData.movies.slice(0, 2).map((movie) => ({
                    ...movie,
                    friend: friendData.friend,
                }))
            )
            setCarouselMovies(movies)
        } else if (topMovies) {
            // If no friend movies, use top movies from TMDB
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
                <CarouselCard
                    key={movie.id}
                    id={movie.id}
                    poster_path={movie.poster_path}
                    backdrop_path={movie.backdrop_path}
                    friend={movie.friend}
                    overview={movie.overview}
                    title={movie.title}
                    release_date={movie.release_date}
                />
            ))}
        </div>
    )
}

export default MovieCarousel
