import { type Request, type Response, type NextFunction, Router } from "express";
import User from '../models/User';
import { verifyToken } from "../middleware/verifyToken";
import { checkEmailExists, checkUsernameAvailability, searchUsers } from '../controllers/userController';


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
    console.log("onboarding : ",username,friends,profile_image,directors);
    
    if (req.user?.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedUser = await User.findByIdAndUpdate(uid, {
      onboarded: true,
      username,
      profile_image,
      topMovies,
      directors,
      friends
    }, { new: true });

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