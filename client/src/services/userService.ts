import { IUser } from "../Types/User"
import { MdOutlineGroups3 } from "react-icons/md";
import axios from 'axios';
import { useAuth } from "../hooks/useAuth";
import { auth } from "../pages/auth/firebase";

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


  export const updateUserProfile = async (userId: string, data: Partial<IUser>): Promise<IUser> => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      console.log("in profile token is : ",idToken);
      
  
      const response = await axios.put(`http://localhost:8080/api/user/${userId}/profile`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });
      console.log("response :: ",response.data);
      
      const updatedUser = response.data.user;

  
      // Update local storage if onboarded status changed
      
      if (data.onboarded !== undefined) {
        
        
        localStorage.setItem('onboarded', updatedUser.onboarded.toString());
      }
      
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update user profile');
    }
  };
  
  export const checkOnboardedStatus = async (userId: string): Promise<boolean> => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      console.log("in check onboarded token is : ",idToken);
      
  
      const response = await axios.get(`http://localhost:8080/api/user/${userId}/onboarded`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });
  
      return response.data.onboarded; 
    } catch (error) {
      throw new Error('Failed to check onboarded status');
    }
  }


export const searchUsers = async (searchTerm: string): Promise<IUser[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    
    const response = await axios.get(`http://localhost:8080/api/user/check-username/${username}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    });

    return response.data.isAvailable;
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw new Error('Failed to check username availability');
  }
};