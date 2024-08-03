import React from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { searchDirectors } from '../../../services/directorService';

const topDirectorsSchema = z.object({
  topDirectors: z.array(z.string()).max(5),
});

type TopDirectorsData = z.infer<typeof topDirectorsSchema>;

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const TopDirectors: React.FC<Props> = ({ onNext, onPrevious }) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<TopDirectorsData>();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: directors, isLoading } = useQuery({
    queryKey: ['directors', searchTerm],
    queryFn: () => searchDirectors(searchTerm),
    enabled: searchTerm.length > 2,
  });

  const topDirectors = watch('topDirectors');

  const handleAddDirector = (directorId: string) => {
    if (topDirectors.length < 5) {
      setValue('topDirectors', [...topDirectors, directorId]);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-tr from-secondary to-primary shadow-lg rounded-lg max-w-md hover:ring-1">
      <h2 className="text-2xl font-bold mb-4">Select Your Top 5 Directors</h2>
      <input
        type="text"
        placeholder="Search directors"
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered w-full mb-4"
      />
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ul className="mb-4">
          {directors?.map((director) => (
            <li key={director.id} className="flex justify-between items-center mb-2">
              <span>{director.name}</span>
              <button type='button' className="btn btn-secondary btn-sm" onClick={() => handleAddDirector(director.id)}>Add</button>
            </li>
          ))}
        </ul>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Your Top Directors:</h3>
        <ul>
          {topDirectors.map((directorId) => (
            <li key={directorId} className="mb-1">{directorId}</li>
          ))}
        </ul>
      </div>
      {errors.topDirectors && <span className="text-red-500">{errors.topDirectors.message}</span>}
      <div className="flex justify-between">
        <button type='button' className="btn btn-secondary" onClick={onPrevious}>Previous</button>
        <button type='button' className="btn btn-primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default TopDirectors;
