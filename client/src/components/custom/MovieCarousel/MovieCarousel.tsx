import React, { useState, useEffect, useCallback, useRef } from "react";
import CarouselCard from "./CarouselCard";
import { useFriendTopMovies } from "@/services/friendsService";
import { useMovieList } from "@/services/movieService";
import { SimpleMovie } from "@/Types/Movie";

const MovieCarousel: React.FC = () => {
    const {
        data: friendMoviesData,
        isLoading: isFriendMoviesLoading,
        error: friendMoviesError,
    } = useFriendTopMovies();
    const {
        data: topMovies,
        isLoading: isTopMoviesLoading,
        error: topMoviesError,
    } = useMovieList("popular", 1);
    
    const [carouselMovies, setCarouselMovies] = useState<SimpleMovie[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (friendMoviesData && friendMoviesData.length > 0) {
            const movies = friendMoviesData.flatMap((friendData) =>
                friendData.movies.slice(0, 2).map((movie) => ({
                    ...movie,
                    friend: friendData.friend,
                }))
            );

            if (movies.length > 0) {
                setCarouselMovies(movies);
            } else if (topMovies) {
                setCarouselMovies(
                    topMovies.map((movie) => ({ ...movie, friend: "" }))
                );
            }
        } else if (topMovies) {
            setCarouselMovies(
                topMovies.map((movie) => ({ ...movie, friend: "" }))
            );
        }
    }, [friendMoviesData, topMovies]);

    const updateSlide = useCallback((newSlide: number) => {
        setCurrentSlide(Math.max(0, Math.min(newSlide, carouselMovies.length - 1)));
    }, [carouselMovies.length]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - dragOffset);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const currentX = e.pageX - startX;
        setDragOffset(currentX);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        
        const slideWidth = carouselRef.current?.offsetWidth || 0;
        const dragThreshold = slideWidth / 4;
        
        if (Math.abs(dragOffset) > dragThreshold) {
            const direction = dragOffset > 0 ? -1 : 1;
            updateSlide(currentSlide + direction);
        }
        
        setDragOffset(0);
    };

    useEffect(() => {
        const handleMouseUpOutside = () => {
            if (isDragging) {
                handleMouseUp();
            }
        };

        document.addEventListener('mouseup', handleMouseUpOutside);
        return () => {
            document.removeEventListener('mouseup', handleMouseUpOutside);
        };
    }, [isDragging, handleMouseUp]);

    if (isFriendMoviesLoading || isTopMoviesLoading) {
        return <div>Loading...</div>;
    }

    if (friendMoviesError || topMoviesError) {
        return <div>Error loading movies</div>;
    }

    if (carouselMovies.length === 0) {
        return <div>No movies available</div>;
    }

    return (
        <div 
            ref={carouselRef}
            className="carousel w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden" 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div 
                className="flex transition-transform duration-300 ease-out"
                style={{
                    transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
                    width: `${carouselMovies.length * 100}%`,
                }}
            >
                {carouselMovies.map((movie) => (
                    <CarouselCard key={movie.movie_id} {...movie} />
                ))}
            </div>

            {currentSlide > 0 && (
                <button
                    onClick={() => updateSlide(currentSlide - 1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-r text-white"
                >
                    &lt;
                </button>
            )}
            {currentSlide < carouselMovies.length - 1 && (
                <button
                    onClick={() => updateSlide(currentSlide + 1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-l text-white"
                >
                    &gt;
                </button>
            )}

            <div className="absolute bottom-4 right-4 flex items-center gap-1 z-30">
                {carouselMovies.map((_, index) => (
                    <div
                        key={index}
                        className={`h-[1px] transition-all duration-300 ${
                            index === currentSlide 
                                ? 'bg-gray-100 w-[20px]'
                                : 'bg-gray-600 w-[10px]'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MovieCarousel;