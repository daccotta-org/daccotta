import MovieCarousel from "@/components/custom/MovieCarousel/MovieCarousel"
import ProfileIcon from "@/components/custom/ProfileIcon/ProfileIcon"
import PopoverRadix from "@/components/custom/PopoverRadix"
const HomePage = () => {
    return (
        <>
            <main className="w-full h-full relative z-0">
                <div className="flex justify-end absolute z-50 right-0 top-0 ">
                    <ProfileIcon />
                </div>
                <MovieCarousel />
                <div className="flex flex-col justify-center text-white">
                    <PopoverRadix />
                    <p className="font-lato font-light">Lato Light</p>
                    <p className="font-lato">Lato Regular</p>
                    <p className="font-lato font-bold">Lato Bold</p>
                    <p className="font-noto">Noto Sans Regular</p>
                    <p className="font-noto font-bold">Noto Sans Bold</p>
                    <p className="font-montserrat">Montserrat Regular</p>
                    <p className="font-montserrat font-bold">Montserrat Bold</p>
                    <p className="font-roboto">Roboto Regular</p>
                    <p className="font-roboto font-bold">Roboto Bold</p>
                    <p>Matemasie</p>
                </div>
            </main>
        </>
    )
}

export default HomePage
