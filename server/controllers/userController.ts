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