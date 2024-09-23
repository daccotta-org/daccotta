// import React, { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { FaSearch } from "react-icons/fa"
// import { toast } from "react-toastify"
// import "../../index.css"
// import { useSearchMovies } from "@/services/movieService"
// import { SimpleMovie } from "@/Types/Movie"
// import { genreMap } from "@/lib/stats"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Button } from "@/components/ui/button"
// import { ChevronDown } from "lucide-react"

// const SearchMovie: React.FC = () => {
//     const navigate = useNavigate()
//     const [searchTerm, setSearchTerm] = useState<string>("")
//     const [selectedYear, setSelectedYear] = useState<string>("")
//     const [selectedGenre, setSelectedGenre] = useState<string>("")
//     const {
//         data: movies,
//         isLoading,
//         error,
//     } = useSearchMovies(
//         searchTerm,
//         selectedYear ? parseInt(selectedYear) : undefined,
//         selectedGenre ? parseInt(selectedGenre) : undefined
//     )

//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(e.target.value)
//     }

//     if (error) {
//         toast.error("An error occurred while searching for movies.")
//     }

//     const handleclick = (id: string) => () => {
//         navigate(`/movie/${id}`)
//     }

//     const currentYear = new Date().getFullYear()
//     const years = Array.from({ length: 70 }, (_, i) => currentYear - i)
//     const genres = Object.entries(genreMap)

//     return (
//         <div className="min-h-screen w-full p-4 bg-background text-white flex flex-col items-center justify-start">
//             <div className="w-full max-w-3xl rounded-2xl p-4 bg-background text-white shadow-2xl">
//                 <h1 className="text-2xl font-bold mb-4 italic text-center font-Montserrat">
//                     Find your favorite movies.
//                 </h1>
//                 <div className="mb-6 relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <FaSearch className="text-gray-400" />
//                     </div>
//                     <input
//                         type="text"
//                         className="w-full pl-10 pr-10 py-2 rounded-2xl focus:outline-none focus:ring bg-white bg-opacity-10 text-white"
//                         placeholder="Search Movies"
//                         value={searchTerm}
//                         onChange={handleSearch}
//                     />
//                     {isLoading && searchTerm.length > 2 && (
//                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                             <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                         </div>
//                     )}
//                 </div>
//                 <div className="flex justify-between space-x-4 mb-6">
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button
//                                 variant="outline"
//                                 className="w-1/4 bg-background hover:bg-secondary bg-opacity-10 text-white"
//                             >
//                                 {selectedYear || "Select Year"}
//                                 <ChevronDown className="ml-2 h-4 w-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="max-h-[400px] overflow-y-auto">
//                             {years.map((year) => (
//                                 <DropdownMenuItem
//                                     key={year}
//                                     onSelect={() =>
//                                         setSelectedYear(year.toString())
//                                     }
//                                 >
//                                     {year}
//                                 </DropdownMenuItem>
//                             ))}
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button
//                                 variant="outline"
//                                 className="w-1/4 bg-background hover:bg-secondary"
//                             >
//                                 {selectedGenre
//                                     ? genreMap[parseInt(selectedGenre)]
//                                     : "Select Genre"}
//                                 <ChevronDown className="ml-2 h-4 w-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="max-h-[400px] overflow-y-auto">
//                             {genres.map(([id, name]) => (
//                                 <DropdownMenuItem
//                                     key={id}
//                                     onSelect={() => setSelectedGenre(id)}
//                                 >
//                                     {name}
//                                 </DropdownMenuItem>
//                             ))}
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//                 {isLoading && searchTerm.length > 2 ? (
//                     <p className="text-center text-gray-500">Loading...</p>
//                 ) : (
//                     <ul className="max-h-[300px] overflow-y-auto bg-white bg-opacity-10 rounded-lg shadow-lg mb-6">
//                         {movies && movies.length > 0
//                             ? movies.map((movie: SimpleMovie) => (
//                                   <li
//                                       key={movie.id}
//                                       className="flex items-center space-x-4 p-3 hover:bg-white hover:bg-opacity-20 cursor-pointer border-b border-white border-opacity-20"
//                                       onClick={handleclick(movie.id)}
//                                   >
//                                       {movie.poster_path && (
//                                           <img
//                                               src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
//                                               alt={movie.title}
//                                               className="w-16 h-24 object-cover rounded"
//                                           />
//                                       )}
//                                       <div>
//                                           <h3 className="font-semibold">
//                                               {movie.title}
//                                           </h3>
//                                           <p className="text-sm text-gray-300">
//                                               {movie.release_date}
//                                           </p>
//                                           <p className="text-sm text-gray-300">
//                                               {movie.genre_ids
//                                                   ?.map((id) => genreMap[id])
//                                                   .join(", ")}
//                                           </p>
//                                       </div>
//                                   </li>
//                               ))
//                             : searchTerm.length > 2 && (
//                                   <li className="p-3 text-center">
//                                       No movies found.
//                                   </li>
//                               )}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default SearchMovie
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import { toast } from "react-toastify"
import "../../index.css"
import { useSearchMovies } from "@/services/movieService"
import { SimpleMovie } from "@/Types/Movie"
import { genreMap } from "@/lib/stats"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, X } from "lucide-react"

const SearchMovie: React.FC = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedYear, setSelectedYear] = useState<string>("")
    const [selectedGenre, setSelectedGenre] = useState<string>("")
    const {
        data: movies,
        isLoading,
        error,
    } = useSearchMovies(
        searchTerm,
        selectedYear ? parseInt(selectedYear) : undefined,
        selectedGenre ? parseInt(selectedGenre) : undefined
    )

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    if (error) {
        toast.error("An error occurred while searching for movies.")
    }

    const handleclick = (id: string) => () => {
        navigate(`/movie/${id}`)
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 70 }, (_, i) => currentYear - i)
    const genres = Object.entries(genreMap)

    const handleYearSelect = (year: string) => {
        setSelectedYear(year === selectedYear ? "" : year)
    }

    const handleGenreSelect = (genreId: string) => {
        setSelectedGenre(genreId === selectedGenre ? "" : genreId)
    }

    return (
        <div className="min-h-screen w-full p-4 bg-background text-white flex flex-col items-center justify-start">
            <div className="w-full max-w-3xl rounded-2xl p-4 bg-background text-white shadow-2xl">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 italic text-center font-Montserrat">
                    Find your favorite movies.
                </h1>
                <div className="mb-6 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-10 py-2 rounded-2xl focus:outline-none focus:ring bg-white bg-opacity-10 text-white"
                        placeholder="Search Movies"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {isLoading && searchTerm.length > 2 && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full sm:w-40 bg-background  hover:bg-gradient-to-tr hover:from-gray-900  hover:to-gray-700 bg-opacity-10 text-white">
                                    {selectedYear || "Select Year"}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-[400px] overflow-y-auto">
                                {years.map((year) => (
                                    <DropdownMenuItem
                                        key={year}
                                        className=" hover:bg-gradient-to-br hover:from-gray-900  hover:to-gray-700"
                                        onSelect={() =>
                                            handleYearSelect(year.toString())
                                        }
                                    >
                                        {year}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {selectedYear && (
                            <Button
                                onClick={() => setSelectedYear("")}
                                className="p-2"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full sm:w-40 bg-background  hover:bg-gradient-to-tr hover:from-gray-900  hover:to-gray-700">
                                    {selectedGenre
                                        ? genreMap[parseInt(selectedGenre)]
                                        : "Select Genre"}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-[400px] overflow-y-auto">
                                {genres.map(([id, name]) => (
                                    <DropdownMenuItem
                                        key={id}
                                        onSelect={() => handleGenreSelect(id)}
                                    >
                                        {name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {selectedGenre && (
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedGenre("")}
                                className="p-2"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
                {isLoading && searchTerm.length > 2 ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <ul className="max-h-[300px] overflow-y-auto bg-white bg-opacity-10 rounded-lg shadow-lg mb-6">
                        {movies && movies.length > 0
                            ? movies.map((movie: SimpleMovie) => (
                                  <li
                                      key={movie.id}
                                      className="flex items-center space-x-4 p-3 hover:bg-white hover:bg-opacity-20 cursor-pointer border-b border-white border-opacity-20"
                                      onClick={handleclick(movie.id)}
                                  >
                                      {movie.poster_path && (
                                          <img
                                              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                              alt={movie.title}
                                              className="w-16 h-24 object-cover rounded"
                                          />
                                      )}
                                      <div className="flex-grow">
                                          <h3 className="font-semibold">
                                              {movie.title}
                                          </h3>
                                          <p className="text-sm text-gray-300">
                                              {movie.release_date}
                                          </p>
                                          <p className="text-sm text-gray-300">
                                              {movie.genre_ids
                                                  ?.map((id) => genreMap[id])
                                                  .join(", ")}
                                          </p>
                                      </div>
                                  </li>
                              ))
                            : searchTerm.length > 2 && (
                                  <li className="p-3 text-center">
                                      No movies found.
                                  </li>
                              )}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default SearchMovie
