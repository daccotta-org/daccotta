import React, { FC } from "react"
import LazyImage from "../LazyLoadImage/LazyImage"

export interface CardProps {
    movie_id: string // movie id
    friend: string
    title: string
    overview: string
    poster_path: string
    backdrop_path: string
}

const image_url = "https://image.tmdb.org/t/p"

const CarouselCard: FC<CardProps> = ({
    movie_id,
    friend,
    title,
    overview,
    poster_path,
    backdrop_path,
}) => {
    return (
        <div
            id={movie_id}
            className="  carousel-prime-card carousel-item relative w-full h-[400px] bg-cover bg-center rounded-lg overflow-hidden"
            style={{
                backgroundImage: `url(${image_url}/w1280${backdrop_path})`,
            }}
        >
            <div
                className="absolute inset-0 bg-black bg-opacity-50 blur-sm"
                style={{
                    backdropFilter: "blur(5px)",
                }}
            ></div>
            <div className="absolute inset-0 flex items-center p-6">
                {/* Poster Image */}
                <LazyImage
                    src={`${image_url}/w300${poster_path}`}
                    alt={title}
                    className="w-[150px] h-auto rounded-lg shadow-lg z-10"
                />
                {/* Movie Details */}
                <div className="ml-6 text-white z-10">
                    <h2 className="text-3xl font-bold">{title}</h2>
                    <div className="mt-2 flex space-x-4">
                        <p className="text-sm font-light">
                            Release Date: 2023-08-15
                        </p>
                        <p className="text-sm font-light">
                            Genre: Action, Drama
                        </p>
                    </div>

                    <p className="mt-4 text-lg max-w-3xl">{overview}</p>
                    {/* Release Date and Genre */}
                    <p className="mt-4 text-sm">
                        Watched by{" "}
                        <span className=" font-bold text-cyan-400">
                            {friend}
                        </span>{" "}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CarouselCard
