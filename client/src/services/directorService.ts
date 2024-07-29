import { Director } from "../Types/Director";

const mockDirectors: Director[] = [
  { id: '1', name: 'Christopher Nolan' },
  { id: '2', name: 'Martin Scorsese' },
  { id: '3', name: 'Quentin Tarantino' },
  { id: '4', name: 'Steven Spielberg' },
  { id: '5', name: 'Alfred Hitchcock' },
];

export const searchDirectors = async (searchTerm: string): Promise<Director[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockDirectors.filter(director => 
    director.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};