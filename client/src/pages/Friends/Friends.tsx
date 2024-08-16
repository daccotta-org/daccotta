import React, { useState } from 'react';

interface User {
  id: number;
  username: string;
}

// Mock user data
const usersData:any = [];


const FriendSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [friendsList, setFriendsList] = useState<User[]>([]);

  // Filter users based on search term
  const filteredUsers = usersData.filter((user:any) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle user selection
  const handleUserClick = (user: User) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.some((selected) => selected.id === user.id)) {
        // Remove user if already selected
        return prevSelected.filter((selected) => selected.id !== user.id);
      } else {
        // Add user if not already selected
        return [...prevSelected, user];
      }
    });
  };

  // Handle add friend button click
  const handleAddFriends = () => {
    setFriendsList((prevFriends) => [...prevFriends, ...selectedUsers]);
    setSelectedUsers([]); // Clear selected users
    setSearchTerm(''); // Clear search term
  };

  return (
    <div className="h-screen w-screen p-4 bg-gradient-to-b from-gray-900 to-blue-900 text-white flex flex-col items-center justify-start">
      <div className="w-2/3 max-w-[50%] rounded-lg p-4 shadow-lg bg-blue-900">
        <h1 className="text-2xl font-bold mb-4 text-center">Friends</h1>
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="w-[70%] px-4 py-2 rounded-l-lg focus:outline-none focus:ring focus:border-blue-300 text-black"
            placeholder="Search username"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg w-auto"
            onClick={handleAddFriends}
          >
            Add Friend
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto w-[70%] justify-center items-center">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center mb-2 p-2  rounded-lg cursor-pointer transition-colors ${
                selectedUsers.some((selected) => selected.id === user.id)
                  ? 'bg-blue-300'
                  : 'bg-blue-200'
              }`}
              onClick={() => handleUserClick(user)}
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex-shrink-0 mr-2 text"></div>
              <span className="font-medium text-black">{user.username}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold ">Friends List</h2>
          {friendsList.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center mb-2 p-2 rounded-lg bg-blue-200"
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex-shrink-0 mr-2"></div>
              <span className="font-medium text-black">{friend.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendSearch;