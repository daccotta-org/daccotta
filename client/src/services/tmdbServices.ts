import axios from "axios"
import { config } from "@/lib/config"

const BASE_URL = config.tmdb.baseUrl
const TMDB_TOKEN = config.tmdb.apiKey

const headers = {
    Authorization: "Bearer " + TMDB_TOKEN,
}

// Define a type for the params
type TMDBParams = {
    [key: string]: string | number | boolean | undefined
}

export const fetchDataFromApi = async (url: string, params?: TMDBParams) => {
    try {
        const { data } = await axios.get(BASE_URL + url, {
            headers,
            params,
        })
        return data
    } catch (err) {
        console.error(err)
        throw err
    }
}
