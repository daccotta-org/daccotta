
import { type Request, type Response, Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import ListModel, { type List } from '../models/List';
import User from '../models/User';

const router = Router();

console.log("I am here in listRoutes");

router.post('/create', verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, description, isPublic, list_type, movies, members } = req.body;    
    const userId = req.user?.uid;

    console.log("userId is : ", userId);
    console.log("req.user is : ", req.user);
    console.log("req.body is : ", req.body);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' }); 
    }

    const newListData: Partial<List> = {      
      name: name,
      list_type: list_type || 'user',
      movies: movies || [],
      members: members || [{ user_id: userId, is_author: true }],
      date_created: new Date(),
      description: description || '',
      isPublic: isPublic || false,
    };

    console.log("newListData is for the Route call is here: ", newListData);

    // Create a new list
    const newList = new ListModel(newListData);
    const savedList = await newList.save();

    console.log("savedList is: ", savedList);

    // Update the user's lists
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { lists: savedList } },  // Push the entire list object
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(201).json({
      message: 'List created successfully',
      list: savedList,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as listRoutes };



