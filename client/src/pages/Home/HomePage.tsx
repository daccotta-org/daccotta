import { useState, useEffect } from "react"
import MovieList from "@/components/custom/MovieCard/Carousel"
import MovieCarousel from "@/components/custom/MovieCarousel/MovieCarousel"
import ProfileIcon from "@/components/custom/ProfileIcon/ProfileIcon"

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => {
        if (window.pageYOffset > 100) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility)
        return () => {
            window.removeEventListener("scroll", toggleVisibility)
        }
    }, [])

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 p-3 bg-gray-700 text-white rounded-full shadow-lg transition-opacity ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transition: "opacity 0.3s" }}
            title="Scroll to top"
        >
            ↑
        </button>
    )
}

const HomePage = () => {
    return (
        <>
            <main className="w-full max-h-screen mt-0 z-0 overflow-auto scrollbar-hide">
                <MovieCarousel />
                <div className="flex justify-end absolute z-50 right-0 top-0">
                    <ProfileIcon />
                </div>

                <div className="flex flex-col p-2 mb-12 h-auto text-white">
                    <MovieList type="popular" heading="Top Movies This Week" />
                    <MovieList
                        type="top_rated"
                        heading="Top Rated Movies of All Time"
                        noFavGenre={true}
                    />
                </div>

                {/* Scroll to Top Button */}
                <ScrollToTopButton />
            </main>
        </>
    )
}

export default HomePage
