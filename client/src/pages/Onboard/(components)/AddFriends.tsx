import React from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../../../services/userService';

const friendsSchema = z.object({
  friends: z.array(z.string()),
});

type FriendsData = z.infer<typeof friendsSchema>;

interface Props {
  onPrevious: () => void;
}

const AddFriends: React.FC<Props> = ({ onPrevious }) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<FriendsData>();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: () => searchUsers(searchTerm),
    enabled: searchTerm.length > 2,
  });

  const friends = watch('friends');

  const handleAddFriend = (userId: string) => {
    setValue('friends', [...friends, userId]);
  };

  return (
    <div className="p-4 bg-gradient-to-tr from-secondary to-primary shadow-lg rounded-lg max-w-md hover:ring-1 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Friends</h2>
      <input
        type="text"
        className="input input-bordered w-full mb-4"
        placeholder="Search users"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <ul className="list-disc list-inside mb-4">
          {users?.map((user) => (
            <li key={user.id} className="flex justify-between items-center mb-2">
              <span>{user.username}</span>
              <button type='button' className="btn btn-secondary btn-sm" onClick={() => handleAddFriend(user.id)}>Add</button>
            </li>
          ))}
        </ul>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Your Friends:</h3>
        <ul className="list-disc list-inside">
          {friends.map((friendId) => (
            <li key={friendId} className="mb-2">{friendId}</li>
          ))}
        </ul>
      </div>
      {errors.friends && <span className="text-red-500">{errors.friends.message}</span>}
      <div className="flex justify-between">
        <button type='button' className="btn btn-secondary" onClick={onPrevious}>Previous</button>
      </div>
    </div>
  );
};

export default AddFriends;
