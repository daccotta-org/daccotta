
import CarouselCard, { CardProps } from "./CarouselCard"
// interface Movies {
//     movie: CardProps[]
// }
const MovieData: CardProps[] = [
    {
        movie_id: "49026",
        backdrop_path: "/c3OHQncTAnKFhdOTX7D3LTW6son.jpg",
        friend: "siddharth",
        title: "The Dark Knight",
        overview:
            "Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent's crimes to protect the late attorney's reputation and is subsequently hunted by the Gotham City Police Department. Eight years later, Batman encounters the mysterious Selina Kyle and the villainous Bane, a new terrorist leader who overwhelms Gotham's finest. The Dark Knight resurfaces to protect a city that has branded him an enemy.",
        poster_path: "/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
    },
    {
        movie_id: "49027",
        backdrop_path: "/c3OHQncTAnKFhdOTX7D3LTW6son.jpg",
        friend: "ashu",
        title: "The Dark Knight Rises",
        overview:
            "Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent's crimes to protect the late attorney's reputation and is subsequently hunted by the Gotham City Police Department. Eight years later, Batman encounters the mysterious Selina Kyle and the villainous Bane, a new terrorist leader who overwhelms Gotham's finest. The Dark Knight resurfaces to protect a city that has branded him an enemy.",
        poster_path: "/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
    },
]

const MovieCarousel = () => {
    return (
        <div className="carousel w-full">
            {MovieData.map((movie) => (
                <CarouselCard
                    movie_id={movie.movie_id}
                    poster_path={movie.poster_path}
                    backdrop_path={movie.backdrop_path}
                    friend={movie.friend}
                    overview={movie.overview}
                    title={movie.title}
                />
            ))}
        </div>
    )
}

export default MovieCarousel
