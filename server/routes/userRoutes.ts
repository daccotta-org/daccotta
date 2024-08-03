// routes/userRoutes.ts
import { Router } from "express";
import User from '../models/User';
import admin from 'firebase-admin';

const router = Router();

// Route to check onboarded status
router.get('/:uid/onboarded', async (req, res) => {
  try {
    const { uid } = req.params;
    
    // Verify the Firebase ID token
    const authHeader = req.headers.authorization;
    const idToken = authHeader && authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    if (decodedToken.uid !== uid) {
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

router.post('/:uid/complete-onboarding', async (req, res) => {
    try {
      const { uid } = req.params;
      
      // Verify the Firebase ID token
      const authHeader = req.headers.authorization;
      const idToken = authHeader && authHeader.split('Bearer ')[1];
      
      if (!idToken) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      if (decodedToken.uid !== uid) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      const user = await User.findByIdAndUpdate(uid, { onboarded: true }, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'Onboarding completed successfully' });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

export { router as userRoutes };