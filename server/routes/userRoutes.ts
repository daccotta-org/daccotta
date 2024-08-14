import { type Request, type Response, type NextFunction, Router } from "express";
import User from '../models/User';
import { verifyToken } from "../middleware/verifyToken";
import { checkEmailExists, checkUsernameAvailability, searchUsers } from '../controllers/userController';
import { v4 as uuidv4 } from 'uuid';
import type List from "../models/List";

const router = Router();

// Middleware to verify token


// Route to get user data
router.post('/check-email', checkEmailExists);
router.get('/:uid', verifyToken, async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    
    if (req.user?.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
    console.log("user is : ",user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update user profile
router.put('/:uid/profile', verifyToken, async (req: Request, res: Response) => {
  try {
    console.log("I am on");
    
    const { uid } = req.params;
    const updateData = req.body;
    
    if (req.user?.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(uid, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to check onboarded status
router.get('/:uid/onboarded', verifyToken, async (req: Request, res: Response) => {
  try {
    console.log("hek");
    
    const { uid } = req.params;
    
    if (req.user?.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ onboarded: user.onboarded });
  } catch (error) {
    console.error('Error checking onboarded status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to complete onboarding



router.post('/:uid/complete-onboarding', verifyToken, async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    console.log("uid is : ",uid); 
    const { username, profile_image, topMovies, directors, friends } = req.body;
    console.log("username is : ",username);
    console.log("profile_image is : ",profile_image);
    console.log("topMovies is : ",topMovies);
    console.log("directors is : ",directors);
    console.log("friends is : ",friends);


    if (req.user?.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create the top 5 movies list object
    const top5MoviesList = {
      list_id: uuidv4(),
      name: 'Top 5 Movies',
      list_type: 'user' as const,
      movies: topMovies.map((movie: any) => ({
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      })),
      members: [{ user_id: uid, is_author: true }],
      date_created: new Date(),
    };

    const updatedUser = await User.findByIdAndUpdate(
      uid,
      {
        $set: {
          userName: username,
          profile_image,
          directors,
          friends,
          onboarded: true,
        },
        $push: { lists: top5MoviesList }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Onboarding completed successfully', user: updatedUser });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Route to check unique username
router.get('/check-username/:userName', checkUsernameAvailability);
router.get('/:uid/search', verifyToken, searchUsers);

export { router as userRoutes };