import React from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

const usernameSchema = z.object({
  username: z.string().min(3).max(20),
  //profilePicture: z.any().optional(),
});

type UsernameData = z.infer<typeof usernameSchema>;

interface Props {
  onNext: () => void;
}

const UsernameAndPicture: React.FC<Props> = ({ onNext }) => {
  const { register, formState: { errors }, handleSubmit } = useFormContext<UsernameData>();

  const onSubmit = (data: UsernameData) => {
    console.log(data);
    onNext();
  };

  return (
    <div className="p-4 bg-gradient-to-tr from-secondary to-primary shadow-lg rounded-lg max-w-md hover:ring-1 ">
      <h2 className="text-2xl font-bold mb-4">Set Your Username and Profile Picture</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <input
          {...register('username')}
          className="input input-bordered w-full"
          placeholder="Username"
        />
        {errors.username && <span className="text-red-500">{errors.username.message}</span>}
        
        {/* <input
          type="file"
          {...register('profilePicture')}
          className="input input-bordered w-full"
        /> */}
        
        <button type="button" className="btn btn-primary w-full" onClick={handleSubmit(onSubmit)}>Next</button>
      </form>
    </div>
  );
};

export default UsernameAndPicture;