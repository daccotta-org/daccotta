import { IUser } from "../Types/User"
import { auth } from '../pages/auth/firebase';
import { User } from 'firebase/auth';

const mockUsers: IUser[] = [
    {
      id: '1',
      name: 'John Doe',
      username: 'john_doe',
      email: 'john@example.com',
      age: 30,
      badges: ['Cinephile', 'Early Adopter'],
      groups: [
        { 
          id: 'g1', 
          name: 'Movie Buffs', 
          description: 'A group for serious movie enthusiasts',
          members: [], // Just the ID of John Doe for now
          icon: MdOutlineGroups3 

        }
      ],
      lists: ['Favorite Sci-Fi', 'Must-Watch Classics'],
      directors: ['Christopher Nolan', 'Quentin Tarantino'],
      actors: ['Tom Hanks', 'Meryl Streep']
    },
    {
      id: '2',
      name: 'Jane Smith',
      username: 'jane_smith',
      email: 'jane@example.com',
      age: 28,
      badges: ['Film Critic'],
      groups: [
        {
          id: 'g2',
          name: 'Indie Film Lovers',
          description: 'Exploring the world of independent cinema',
          members: [], // Just the ID of Jane Smith for now
          icon:MdOutlineGroups3

         
        }
      ],
      lists: ['Top Documentaries', 'Underrated Gems'],
      directors: ['Wes Anderson', 'Sofia Coppola'],
      actors: ['Joaquin Phoenix', 'Cate Blanchett']
    },
    {
      id: '3',
      name: 'Bob Johnson',
      username: 'bob_johnson',
      email: 'bob@example.com',
      age: 35,
      badges: ['Horror Fan'],
      groups: [
        {
          id: 'g3',
          name: 'Thriller Enthusiasts',
          description: 'For those who love edge-of-your-seat movies',
          members: [], // Just the ID of Bob Johnson for now
          icon: MdOutlineGroups3
         
        }
      ],
      lists: ['Best Horror Movies', 'Psychological Thrillers'],
      directors: ['Alfred Hitchcock', 'John Carpenter'],
      actors: ['Anthony Hopkins', 'Sigourney Weaver']
    },
  ];

  //old update user service
// export const updateUserProfile = async (userId: string, data: Partial<IUser>): Promise<IUser> => {
//   // Simulate API call delay
//   await new Promise(resolve => setTimeout(resolve, 1000));
  
//   const user = mockUsers.find(u => u.id === userId);
//   if (!user) {
//     throw new Error('User not found');
//   }
  
//   Object.assign(user, data);
//   console.log("user is : ",user);
  
//   return user;
// };

//new update user profile
const getIdToken = async (): Promise<string> => {
  const currentUser: User | null = auth.currentUser;

  if (currentUser) {
    return await currentUser.getIdToken(/* forceRefresh */ true);
  }

  throw new Error('User is not authenticated');
};

export const updateUserProfile = async (uid: string, data: IUser): Promise<void> => {
  try {
    const idToken = await getIdToken();
    const response = await fetch(`/api/user/${uid}/complete-onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`, // Use the ID token for authorization
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const searchUsers = async (searchTerm: string): Promise<IUser[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
};