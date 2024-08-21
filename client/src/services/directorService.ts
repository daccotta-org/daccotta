import { Director } from "../Types/Director";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
const mockDirectors: Director[] = [
  { id: "1", name: "Christopher Nolan" },
  { id: "2", name: "Martin Scorsese" },
  { id: "3", name: "Quentin Tarantino" },
  { id: "4", name: "Steven Spielberg" },
  { id: "5", name: "Alfred Hitchcock" },
];

const TMDB_TOKEN = import.meta.env.VITE_ACCESS_KEY;
const fetchPerson = async (
  searchTerm: string,
  department: "Directing" | "Acting",
) => {
  if (searchTerm.length < 3) return null;

  const url = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(searchTerm)}&language=en-US`;

  const { data } = await axios.get(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  });

  // Filter the results based on the specified department
  const filteredResults = data.results.filter(
    (person: any) => person.known_for_department === department,
  );
  console.log(data.results);

  return { ...data, results: filteredResults };
};

export const useSearchPerson = (
  searchTerm: string,
  department: "Directing" | "Acting",
) => {
  return useQuery({
    queryKey: ["searchPerson", searchTerm, department],
    queryFn: () => fetchPerson(searchTerm, department),
    enabled: searchTerm.length >= 3,
  });
};

export const searchDirectors = async (
  searchTerm: string,
): Promise<Director[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockDirectors.filter((director) =>
    director.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};
