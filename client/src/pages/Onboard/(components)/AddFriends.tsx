import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useSearchUsers } from '../../../services/userService';
import { toast } from 'react-toastify';
import { RxCrossCircled } from 'react-icons/rx';
import { useAuth } from '../../../hooks/useAuth';

// Define the Friends schema
export const friendsSchema = z.object({
  friends: z.array(z.string()).optional(), // Array of user IDs
});

type FriendsData = z.infer<typeof friendsSchema>;
type User = { _id: string; userName: string; profile_image: string | null; };

interface Props {
  onPrevious: () => void;
}

const AddFriends: React.FC<Props> = ({ onPrevious }) => {
  const { setValue, watch, formState: { errors } } = useFormContext<FriendsData>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);
  const { user } = useAuth();
  const { data: users, isLoading } = useSearchUsers(searchTerm, user?.uid);
  
  const friends = watch('friends') || [''];

  const handleAddFriend = (user: User) => {
    

    const isDuplicate = selectedFriends.some((friend) => friend._id === user._id);
    if (isDuplicate) {
      toast.warn("This user is already in your friends list.");
    } else {
      console.log("id : ",user._id);
      friends.push(user._id)
      setValue('friends', friends); 
      console.log(friends);
      
      setSelectedFriends([...selectedFriends, user]); // Store full user object for UI display
      toast.success("Friend added to your list!");
      setSearchTerm('');
    }
  };

  const handleRemoveFriend = (userId: string) => {
    setValue('friends', friends.filter((id) => id !== userId));
    setSelectedFriends(selectedFriends.filter((friend) => friend._id !== userId));
    toast.info("Friend removed from your list.");
  };

  return (
    <div className="w-full h-[100vh] lg:grid lg:grid-cols-5 lg:min-h-screen bg-base-100">
      <div className="p-4 shadow-lg rounded-lg w-full h-screen col-span-2 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Friends</h2>
        <input
          type="text"
          className="input input-bordered w-full mb-4"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <ul className="z-10 overflow-y-auto scrollbar-hide max-h-[300px] bg-white text-gray-800 rounded-lg shadow-lg">
            {searchTerm.length > 3 && users?.slice(0, 10).map((user:User) => (
              <li key={user._id} className="flex justify-between items-center p-3 hover:bg-gray-100 cursor-pointer border-b-2">
                <div className="flex items-center space-x-4">
                  {user.profile_image && (
                    <img
                      src={user.profile_image}
                      alt={user.userName}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  )}
                  <span>{user.userName}</span>
                </div>
                <button type='button' className="btn btn-secondary btn-sm" onClick={() => handleAddFriend(user)}>Add</button>
              </li>
            ))}
          </ul>
        )}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Your Friends:</h3>
          <ul className="space-y-4 h-[180px] overflow-y-auto scrollbar-hide">
            {selectedFriends.map((friend) => (
              <li key={friend._id} className="flex items-center space-x-4 bg-white bg-opacity-10 p-1 w-[400px] border border-primary border-1 rounded-lg hover:bg-primary hover:text-white transition-colors">
                {friend.profile_image && (
                  <img
                    src={friend.profile_image}
                    alt={friend.userName}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                )}
                <span className="flex-grow text-sm">{friend.userName}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFriend(friend._id)}
                >
                  <RxCrossCircled size="24px" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        {errors.friends && <span className="text-red-500">{errors.friends.message}</span>}
        <div className="flex justify-between">
          <button type='button' className="btn btn-secondary text-white" onClick={onPrevious}>Previous</button>
        </div>
      </div>
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-primary lg:col-span-3">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src="/profile_page.svg"
            alt="Sign Up Illustration"
            className="w-[400px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default AddFriends;
