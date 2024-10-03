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

export const getPersonalUserData = async (req: Request, res: Response) => {
  try {
      const { uid } = req.params

      if (req.user?.uid !== uid) {
          return res.status(403).json({ error: "Unauthorized" })
      }

      const user = await User.findById(uid)
      if (!user) {
          return res.status(404).json({ error: "User not found" })
      }

      res.json(user)
  } catch (error) {
      console.error("Error fetching user data:", error)
      res.status(500).json({ error: "Internal server error" })
  }
}

export const getOtherUserData = async (req: Request, res: Response) => {
  try {
      const { uid } = req.params

      const user = await User.findById(uid)
      if (!user) {
          return res.status(404).json({ error: "User not found" })
      }

      res.json(user)
  } catch (error) {
      console.error("Error fetching user data:", error)
      res.status(500).json({ error: "Internal server error" })
  }
}

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
      console.log("I am on")

      const { uid } = req.params
      const updateData = req.body

      if (req.user?.uid !== uid) {
          return res.status(403).json({ error: "Unauthorized" })
      }

      const updatedUser = await User.findByIdAndUpdate(uid, updateData, {
          new: true,
      })
      if (!updatedUser) {
          return res.status(404).json({ error: "User not found" })
      }

      res.json({
          message: "Profile updated successfully",
          user: updatedUser,
      })
  } catch (error) {
      console.error("Error updating profile:", error)
      res.status(500).json({ error: "Internal server error" })
  }
}

export const checkOnboardedStatus = async (req: Request, res: Response) => {
  try {
      const { uid } = req.params

      if (req.user?.uid !== uid) {
          return res.status(403).json({ error: "Unauthorized" })
      }

      const user = await User.findById(uid)
      if (!user) {
          return res.status(404).json({ error: "User not found" })
      }

      res.json({ onboarded: user.onboarded })
  } catch (error) {
      console.error("Error checking onboarded status:", error)
      res.status(500).json({ error: "Internal server error" })
  }
}

export const completeOnboarding = async (req: Request, res: Response) => {
  try {
      const { uid } = req.params
      const { username, profile_image, topMovies, directors, friends } =
          req.body
      if (req.user?.uid !== uid) {
          return res.status(403).json({ error: "Unauthorized" })
      }

      const user = await User.findById(uid)
      if (!user) {
          return res.status(404).json({ error: "User not found" })
      }

      // Update the existing top 5 movies list
      const top5MoviesList = user.lists.find(
          (list) => list.name === "Top 5 Movies"
      )
      if (top5MoviesList) {
          top5MoviesList.movies = topMovies.map((movie: any) => ({
              movie_id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              genre_ids: movie.genre_ids,
          }))
      }

      // Replace fake directors list with user's chosen directors

      user.profile_image = profile_image

      user.onboarded = true

      // Add "Onboarded" badge
      if (!user.badges.includes("Onboarded")) {
          user.badges.push("Onboarded")
      }

      await user.save()

      res.json({
          message: "Onboarding completed successfully",
          user: user,
      })
  } catch (error: unknown) {
      console.error("Error completing onboarding:", error)
      if (error instanceof Error) {
          res.status(500).json({
              error: "Internal server error",
              details: error.message,
          })
      } else {
          res.status(500).json({
              error: "Internal server error",
              details: "An unknown error occurred",
          })
      }
  }
}