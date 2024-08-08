import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_ACCESS_KEY;

const headers = {
  Authorization: "Bearer " + TMDB_TOKEN,
};

// Define a type for the params
type TMDBParams = {
  [key: string]: string | number | boolean | undefined;
};

export const fetchDataFromApi = async (url: string, params?: TMDBParams) => {
  try {
    console.log(TMDB_TOKEN);
    
    const { data } = await axios.get(BASE_URL + url, {
      headers,
      params,
    });
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};