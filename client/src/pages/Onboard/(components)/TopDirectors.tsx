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
    <div>
      <h2>Select Your Top 5 Directors</h2>
      <input
        type="text"
        placeholder="Search directors"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {directors?.map((director) => (
            <li key={director.id}>
              {director.name}
              <button onClick={() => handleAddDirector(director.id)}>Add</button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>Your Top Directors:</h3>
        <ul>
          {topDirectors.map((directorId) => (
            <li key={directorId}>{directorId}</li>
          ))}
        </ul>
      </div>
      {errors.topDirectors && <span>{errors.topDirectors.message}</span>}
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default TopDirectors;