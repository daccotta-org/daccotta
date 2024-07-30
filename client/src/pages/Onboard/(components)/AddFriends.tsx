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
    <div>
      <h2>Add Friends</h2>
      <input
        type="text"
        placeholder="Search users"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users?.map((user) => (
            <li key={user.id}>
              {user.username}
              <button onClick={() => handleAddFriend(user.id)}>Add</button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>Your Friends:</h3>
        <ul>
          {friends.map((friendId) => (
            <li key={friendId}>{friendId}</li>
          ))}
        </ul>
      </div>
      {errors.friends && <span>{errors.friends.message}</span>}
      <button onClick={onPrevious}>Previous</button>
    </div>
  );
};

export default AddFriends;