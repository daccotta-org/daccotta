import { Movie } from "../Types/Movie";

const mockMovies: Movie[] = [
  { id: '1', title: 'The Shawshank Redemption', year: 1994 },
  { id: '2', title: 'The Godfather', year: 1972 },
  { id: '3', title: 'The Dark Knight', year: 2008 },
  { id: '4', title: '12 Angry Men', year: 1957 },
  { id: '5', title: "Schindler's List", year: 1993 },
];

export const searchMovies = async (searchTerm: string): Promise<Movie[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
};