import { FC } from "react"
export interface MovieDetails {
    Title: string
    imdbRating: string
    Year: number
    Poster: string
}
const MovieCard: FC<MovieDetails> = ({ Title, imdbRating, Year, Poster }) => {
    return (
        <div className="card lg:w-56 w-40 ">
            <figure>
                <img
                    src={Poster}
                    alt="movie"
                    className="max-w-full max-h-full object-contain"
                />
            </figure>
            <div className="overlay ">
                <div className=" text-white transition-all duration-300 card-body absolute inset-0 opacity-0 bg-black bg-opacity-0 hover: bg-opacity-50 hover:opacity-100 hover: backdrop-blur-sm flex items-center justify-center ">
                    <h2 className="card-title ">{Title}</h2>
                    <div className="card-actions justify-end">
                        <p>⭐ {imdbRating}</p>
                        <p>📅 {Year}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieCard
