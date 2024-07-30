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
    <div>
      <h2>Set Your Username and Profile Picture</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('username')}
          placeholder="Username"
        />
        {errors.username && <span>{errors.username.message}</span>}
        
        {/* <input
          type="file"
          {...register('profilePicture')}
        /> */}
        
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default UsernameAndPicture;