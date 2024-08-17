import { z } from "zod";

export interface TMDBMovie {
  id: string;
  title?: string;
  poster_path?: string;
  release_date?: string  
}
export interface SimpleMovie {
  id: string;
  title?: string;
  poster_path?: string;
  release_date?: string   
}

export interface Movie {
  id: string;
  title?: string;
  poster_path?: string;
  release_date?: string;
}

export const movieSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  poster_path: z.string().optional(),
  release_date: z.string().optional(),
});