import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SimpleMovie } from "@/Types/Movie";
import { useSearchMovies } from "@/services/movieService";
import { FaSearch } from "react-icons/fa";

interface MovieSearchProps {
  onSelectMovie: (movie: SimpleMovie) => void;
}

export default function MovieSearch({ onSelectMovie }: MovieSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: searchResults, isLoading, error } = useSearchMovies(searchTerm);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-10"
        />
        {isLoading && searchTerm.length > 2 && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {isLoading && searchTerm.length > 2 ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                  onClick={() => onSelectMovie(movie)}
                >
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{movie.title}</h3>
                    <p className="text-sm text-gray-500">{movie.release_date}</p>
                  </div>
                </div>
              ))
            ) : (
              searchTerm.length > 2 && (
                <p className="text-center text-gray-500">No movies found.</p>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}