import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSearchMovies } from "@/services/movieService";
import { SimpleMovie } from "@/Types/Movie";
import { genreMap } from "@/lib/stats";
import { X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SearchMovie: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const { data: movies, isLoading, error } = useSearchMovies(
    searchTerm,
    selectedYear ? parseInt(selectedYear) : undefined,
    selectedGenre ? parseInt(selectedGenre) : undefined
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (error) {
    toast.error("An error occurred while searching for movies.");
  }

  const handleClick = (id: string) => () => {
    navigate(`/movie/${id}`);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => currentYear - i);
  const genres = Object.entries(genreMap);

  const handleYearSelect = (year: string) => {
    setSelectedYear(year === selectedYear ? "" : year);
  };

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId === selectedGenre ? "" : genreId);
  };

  return (
    <div className="w-full max-h-screen overflow-auto scrollbar-hide text-white flex flex-col items-center justify-center">
      <header className="w-full max-w-xl py-8 flex flex-col items-center sm:flex sm:flex-col sm:justify-between">
        {!searchTerm && <h1 className="text-4xl font-bold mb-4 text-center sm:text-left">Find Your Favorite Movie Here</h1>}
        <div className="relative w-[90%] sm:w-full mx-auto">
          <input
            type="text"
            className="w-full pl-14 pr-20 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(193,108,249)]"
            placeholder="Search movies, TV shows, and more"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchTerm && (
           <button
           onClick={() => setSearchTerm("")}
           className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
         >
           <X size={20} />
         </button>
          )}
        </div>
      </header>

      {/* Filter Section */}
      <div className="flex items-center space-x-4 p-4 w-full max-w-xl justify-center flex-wrap">
        <div className="flex items-center space-x-2">
          {/* Year Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full sm:w-40 bg-gray-800 text-white hover:bg-gray-700">
                {selectedYear || "Select Year"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-y-auto bg-gray-800 text-white">
              {years.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => handleYearSelect(year.toString())}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedYear && (
            <Button
              variant="ghost"
              onClick={() => setSelectedYear("")}
              className="p-2 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Genre Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full sm:w-40 bg-gray-800 text-white hover:bg-gray-700">
                {selectedGenre
                  ? genreMap[parseInt(selectedGenre)]
                  : "Select Genre"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-y-auto bg-gray-800 text-white">
              {genres.map(([id, name]) => (
                <DropdownMenuItem
                  key={id}
                  onClick={() => handleGenreSelect(id)}
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
              className="p-2 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Movie List */}
      <div className="flex-1 px-4 py-8 overflow-auto w-full">
        {isLoading && searchTerm.length > 2 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(193,108,249)]"></div>
          </div>
        ) : (
          <>
            {movies && movies.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Search Results</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {movies.map((movie: SimpleMovie) => (
                    <div
                      key={movie.id}
                      className="cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={handleClick(movie.id)}
                    >
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-auto rounded"
                        />
                      ) : (
                        <div className="w-full h-0 pb-[150%] bg-gray-800 rounded flex items-center justify-center">
                          <span className="text-center p-2">{movie.title}</span>
                        </div>
                      )}
                      <h3 className="mt-2 text-sm font-medium truncate">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {movie.release_date?.split("-")[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              searchTerm.length > 2 && (
                <div className="text-center text-gray-400 mt-12">
                  No movies found.
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchMovie;