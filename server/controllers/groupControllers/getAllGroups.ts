// controllers/groups/getAllGroups.ts
import { type Request, type Response } from 'express';
import User from '../../models/User';
import Group from '../../models/Group';

export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id; // Assuming you have user authentication middleware
    const user = await User.findById(userId).populate('groups');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups', error });
  }
};