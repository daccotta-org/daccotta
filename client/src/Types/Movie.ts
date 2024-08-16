export interface TMDBMovie {
  id: number;
  title: string;
  // Add other properties you might need, e.g.:
  poster_path?: string | null;
   release_date?: string | null;
   overview: string;
}
export interface SimpleMovie {
  id: string;
  title: string;
  
}