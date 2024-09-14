import { type Request, type Response, type NextFunction, Router } from "express";
import User from '../models/User';
import { verifyToken } from "../middleware/verifyToken";
import { checkEmailExists, checkUsernameAvailability, searchUsers } from '../controllers/userController';
import ListModel from '../models/List';

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
    const { username, profile_image, topMovies, directors, friends } = req.body;

    if (req.user?.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create the top 5 movies list object
    const top5MoviesList = {
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
      description: 'Top 5 Movies',
      isPublic: true,
      isShared: false,
    };

    const updatedUser = await User.findByIdAndUpdate(
      uid,
      {
        $set: {
          userName: username,
          profile_image,
          directors,
          friends,
          onboarded: true
        },
        $push: { lists: top5MoviesList }  // Directly push the list object
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Onboarding completed successfully', user: updatedUser });
  } catch (error: unknown) {
    console.error('Error completing onboarding:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error', details: 'An unknown error occurred' });
    }
  }
});


//Route to check unique username
router.get('/check-username/:userName', checkUsernameAvailability);
router.get('/:uid/search', verifyToken, searchUsers);

export { router as userRoutes };