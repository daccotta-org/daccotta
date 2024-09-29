import { type Request, type Response, Router } from "express"
import { verifyToken } from "../middleware/verifyToken"
import ListModel, { type List } from "../models/List"
import User from "../models/User"

const router = Router()

console.log("I am here in listRoutes")

router.post("/create", verifyToken, async (req: Request, res: Response) => {
    try {
        const { name, description, isPublic, list_type, movies, members } =
            req.body
        const userId = req.user?.uid

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const newListData: Partial<List> = {
            name: name,
            list_type: list_type || "user",
            movies: movies || [],
            members: members || [{ user_id: userId, is_author: true }],
            date_created: new Date(),
            description: description || "",
            isPublic: isPublic || false,
        }

        console.log("newListData is for the Route call is here: ", newListData)

        // Create a new list
        const newList = new ListModel(newListData)
        const savedList = await newList.save()

        console.log("savedList is: ", savedList)

        // Update the user's lists
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { lists: savedList } }, // Push the entire list object
            { new: true, runValidators: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(201).json({
            message: "List created successfully",
            list: savedList,
            user: updatedUser,
        })
    } catch (error) {
        console.error("Error creating list:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

router.post(
    "/:listId/add-movie",
    verifyToken,
    async (req: Request, res: Response) => {
        try {
            const { listId } = req.params
            const { movie_id, title, poster_path, release_date, genre_ids } =
                req.body
            const userId = req.user?.uid

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" })
            }

            // Find the list
            const list = await ListModel.findOne()
                .where("list_id")
                .equals(listId)

            if (!list) {
                return res.status(404).json({ error: "List not found" })
            }

            // Check if the user is a member of the list
            const isMember = list.members.some(
                (member) => member.user_id === userId
            )
            if (!isMember) {
                return res
                    .status(403)
                    .json({ error: "You are not a member of this list" })
            }

            // Check if the movie already exists in the list
            const movieExists = list.movies.some(
                (movie) => movie.movie_id === movie_id
            )
            if (movieExists) {
                return res
                    .status(400)
                    .json({ error: "Movie already exists in the list" })
            }

            // Add the movie to the list
            list.movies.push({
                movie_id,
                title,
                poster_path,
                release_date,
                genre_ids,
            })
            await list.save()

            // Update the user's list
            await User.findByIdAndUpdate(
                userId,
                { $set: { "lists.$[elem]": list } },
                {
                    arrayFilters: [{ "elem.list_id": listId }],
                    new: true,
                }
            )

            res.status(200).json({
                message: "Movie added to the list successfully",
                list: list,
            })
        } catch (error) {
            console.error("Error adding movie to list:", error)
            res.status(500).json({ error: "Internal server error" })
        }
    }
)

export { router as listRoutes }
