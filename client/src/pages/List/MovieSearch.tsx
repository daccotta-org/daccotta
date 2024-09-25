
// import React, { useState } from 'react';
// import { Input } from "@/components/ui/input";
// import { SimpleMovie } from "@/Types/Movie";
// import { useSearchMovies } from "@/services/movieService";
// import { Search } from "lucide-react";

// interface MovieSearchProps {
//   onSelectMovie: (movie: SimpleMovie) => void;
// }

// export default function MovieSearch({ onSelectMovie }: MovieSearchProps) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const { data: searchResults, isLoading, error } = useSearchMovies(searchTerm);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto p-4 h-[300px]">
//       {/* <h2 className="text-2xl font-bold mb-4">Movie Search</h2> */}
//       <div className="relative mb-4">
//         <Input
//           type="text"
//           placeholder="Search for a movie..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="pr-10"
//         />
//         <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//       </div>
//       <div className="mt-4 max-h-[60vh] overflow-y-auto">
//         {isLoading && searchTerm.length > 2 ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : (
//           <>
//             {searchResults && searchResults.length > 0 ? (
//               <ul className="space-y-2">
//                 {searchResults.map((movie) => (
//                   <li
//                     key={movie.id}
//                     className="p-3 bg-secondary rounded-md hover:bg-secondary/80 cursor-pointer transition-colors"
//                     onClick={() => onSelectMovie(movie)}
//                   >
//                     <div className="flex items-center space-x-4">
//                       {movie.poster_path ? (
//                         <img
//                           src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
//                           alt={movie.title}
//                           className="w-16 h-24 object-cover rounded"
//                         />
//                       ) : (
//                         <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
//                           <span className="text-gray-400">No poster</span>
//                         </div>
//                       )}
//                       <div>
//                         <h3 className="font-semibold">{movie.title}</h3>
//                         <p className='font-light font-xs'>{new Date(movie.release_date).getFullYear()}</p>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               searchTerm.length > 2 && (
//                 <p className="text-center text-gray-500">No movies found.</p>
//               )
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { SimpleMovie } from "@/Types/Movie";
import { useSearchMovies } from "@/services/movieService";
import { Search } from "lucide-react";

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
    <div className="w-[90%] md:w-full max-w-3xl mx-auto p-4 h-500px md:h-[300px] overflow-hidden">    
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={handleSearch}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="mt-4 max-h-[60vh] overflow-y-auto">
        {isLoading && searchTerm.length > 2 ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            {searchResults && searchResults.length > 0 ? (
              <ul className="space-y-2">
                {searchResults.map((movie) => (
                  <li
                    key={movie.id}
                    className="p-3 bg-secondary rounded-md hover:bg-secondary/80 cursor-pointer transition-colors"
                    onClick={() => onSelectMovie(movie)}
                  >
                    <div className="flex items-center space-x-4">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400">No poster</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{movie.title}</h3>
                        <p className="text-sm text-gray-500">{movie.release_date}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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