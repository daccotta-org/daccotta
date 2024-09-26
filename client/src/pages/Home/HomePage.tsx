import MovieList from "@/components/custom/MovieCard/Carousel"
import MovieCarousel from "@/components/custom/MovieCarousel/MovieCarousel"
import ProfileIcon from "@/components/custom/ProfileIcon/ProfileIcon"
console.log("test", import.meta.env.VITE_PROJECT_ID)
const HomePage = () => {
    return (
        <>
            <main className="w-full max-h-screen  mt-0  z-0 overflow-auto scrollbar-hide">
                <MovieCarousel />
                <div className="flex justify-end absolute z-50 right-0 top-0 ">
                    <ProfileIcon />
                </div>

                <div className="flex flex-col  p-2 mb-12 h-auto text-white">
                    {" "}
                    <MovieList type="popular" heading="Top Movies This Week" />
                    <MovieList
                        type="top_rated"
                        heading="Top Rated Movies of All Time"
                        noFavGenre={true}
                    />
                </div>
            </main>
        </>
    )
}

export default HomePage
