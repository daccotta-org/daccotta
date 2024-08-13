import { type Request, type Response } from 'express';
import User from '../models/User';

export const checkUsernameAvailability = async (req: Request, res: Response) => {
  try {
    const { userName } = req.params;

    const existingUser = await User.findOne({ userName: userName.toLowerCase() });

    res.json({ isAvailable: !existingUser });
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const checkEmailExists= async (req:Request, res:Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const { term } = req.query;
    
    // Verify the user
    if (req.user?.uid !== uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!term || typeof term !== 'string') {
      return res.status(400).json({ error: 'Invalid search term' });
    }
    console.log("term is : ",term);
    
    const users = await User.find({
      userName: { $regex: term, $options: 'i' },
      _id: { $ne: uid }, // Exclude the current user from search results
      onboarded: true
    }).select('_id userName profile_image');

    console.log("backend users : ",users);
    res.json(users);
    
    
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};