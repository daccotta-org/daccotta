import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getUserData } from "@/services/userService"
import { Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import CreateList from "../CreateList/CreateList"

interface List {
    list_id: string
    name: string
    movies: { movie_id: string; id: string }[]
}

interface UserData {
    lists: List[]
}

const UserLists: React.FC = () => {
    const [lists, setLists] = useState<List[]>([])
    const [isCreateListOpen, setIsCreateListOpen] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLists = async () => {
            if (user?.uid) {
                try {
                    const userData: UserData = await getUserData(user.uid)
                    setLists(userData.lists)
                } catch (error) {
                    console.error("Error fetching user lists:", error)
                    toast.error("Failed to fetch your lists. Please try again.")
                }
            }
        }

        fetchLists()
    }, [user])

    const handleListClick = (listId: string) => {
        navigate(`/list/${listId}`)
    }

    const handleCreateList = () => {
        setIsCreateListOpen(true)
    }

    const handleListCreated = (newList: List) => {
        setLists((prevLists) => [...prevLists, newList])
        setIsCreateListOpen(false)
        toast.success("New list created successfully!")
    }

    return (
        <div className="w-full min-h-screen overflow-auto py-6  px-12 ">
            <div className="w-full h-full flex lg:flex-row flex-col gap-1 justify-start items-start mb-6">
                <h1 className="text-3xl font-bold mr-2 text-white">
                    Your Movie Lists
                </h1>
                <Dialog
                    open={isCreateListOpen}
                    onOpenChange={setIsCreateListOpen}
                >
                    <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-full">
                            <Plus className="h-5 w-5 mr-2" />
                            <span className="text-white">New List</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        {/* <CreateList onListCreated={handleListCreated} /> */}
                        <h1>create a list</h1>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="space-y-4">
                {lists.map((list) => (
                    <Card
                        key={list.list_id}
                        className="hover:bg-accent transition-colors bg-gradient-to-br from-gray-900 to-gray-800 border-0 cursor-pointer"
                        onClick={() => handleListClick(list.list_id)}
                    >
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {list.name}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {list.movies.length} movies
                                </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 hover:translate-x-1 transition duration-500" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default UserLists
