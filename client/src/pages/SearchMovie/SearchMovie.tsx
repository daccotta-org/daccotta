import React, { useState } from "react"

import { FaSearch } from "react-icons/fa"
import { toast } from "react-toastify"
import "../../index.css"
import { useSearchMovies } from "@/services/movieService"
import { SimpleMovie } from "@/Types/Movie"

const SearchMovie: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const { data: movies, isLoading, error } = useSearchMovies(searchTerm)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    if (error) {
        toast.error("An error occurred while searching for movies.")
    }

    return (
        <div className="min-h-screen w-full p-4 bg-background text-white flex flex-col items-center justify-start">
            <div className="w-full max-w-3xl rounded-2xl p-4 bg-background text-white shadow-2xl">
                <h1 className="text-2xl font-bold mb-4 italic text-center font-Montserrat">
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
                {isLoading && searchTerm.length > 2 ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <ul className="max-h-[300px] overflow-y-auto bg-white bg-opacity-10 rounded-lg shadow-lg mb-6">
                        {movies && movies.length > 0
                            ? movies.map((movie: SimpleMovie) => (
                                  <li
                                      key={movie.id}
                                      className="flex items-center space-x-4 p-3 hover:bg-white hover:bg-opacity-20 cursor-pointer border-b border-white border-opacity-20"
                                  >
                                      {movie.poster_path && (
                                          <img
                                              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                              alt={movie.title}
                                              className="w-16 h-24 object-cover rounded"
                                          />
                                      )}
                                      <div>
                                          <h3 className="font-semibold">
                                              {movie.title}
                                          </h3>
                                          <p className="text-sm text-gray-300">
                                              {movie.release_date}
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
