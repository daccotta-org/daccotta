import MovieCarousel from "@/components/custom/MovieCarousel/MovieCarousel"
import ProfileIcon from "@/components/custom/ProfileIcon/ProfileIcon"
import Button from "@mui/material/Button"
const HomePage = () => {
    return (
        <>
            <main className="w-full h-full relative z-0">
                <div className="flex justify-end absolute z-50 right-0 top-0 ">
                    <ProfileIcon />            
                </div>
                <MovieCarousel />
            </main>
        </>
    )
}

export default HomePage
