import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.ACCESS_TOKEN_SECRET || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzRlZjliMmFhOWIxZTI5MWU1YmIyMDI3ODU1NzYyZSIsIm5iZiI6MTcyMjk0MDkyNS4yNzM5MjQsInN1YiI6IjY2OTk2MGYyZWIxYzVkM2E0NmMxOTEwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.92mUSbl_eL5Pray0VATJy3BwBhJoHlkLls2pusOnf60";

const headers = {
  Authorization: "Bearer " + TMDB_TOKEN,
};

// Define a type for the params
type TMDBParams = {
  [key: string]: string | number | boolean | undefined;
};

export const fetchDataFromApi = async (url: string, params?: TMDBParams) => {
  try {
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