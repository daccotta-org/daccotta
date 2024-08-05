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