import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getUserData } from "@/services/userService"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import CreateList from "../CreateList/CreateList"
import { Drawer } from "@/components/ui/drawer"

interface Movie {
    movie_id: string
    id: string
    title: string
    poster_path: string
}

interface List {
    list_id: string
    name: string
    movies: Movie[]
    description: string
    likes: number
    comments: number
    averageRating: number
}

interface UserData {
    lists: List[]
}
const image_url = "https://image.tmdb.org/t/p"

const UserLists: React.FC = () => {
    const [lists, setLists] = useState<List[]>([])
    const [isCreateListOpen, setIsCreateListOpen] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchVisible, setIsSearchVisible] = useState(false)

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

    const handleCloseDrawer = () => {
        setIsCreateListOpen(false)
    }

    const handleSearchToggle = () => setIsSearchVisible(!isSearchVisible)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }
    
    const filteredLists = lists.filter(list =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="w-full max-h-screen overflow-auto scrollbar-hide text-gray-100 min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">LISTS</h1>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="rounded-full"
                            onClick={handleCreateList}
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            <span className="text-white">New List</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="rounded-full"
                            onClick={handleSearchToggle}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                        {/* <span>Sort by WHEN UPDATED</span>
                        <Eye className="w-5 h-5" /> */}
                    </div>
                </header>
                <div className="space-y-8">
                    {isSearchVisible && (
                        <div className="mt-4 w-full">
                            <Input
                                type="text"
                                placeholder="Search lists..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="rounded-full border pl-5 pr-5 py-2 bg-white bg-opacity-10 text-white focus:ring focus:outline-none w-full"
                            />
                        </div>
                    )}
                    {filteredLists.map((list) => (
                        <div
                            key={list.list_id}
                            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-colors hover:bg-gray-700"
                            onClick={() => handleListClick(list.list_id)}
                        >
                            <div className="flex flex-col md:flex-row">
                                <div className="flex-shrink-0 md:w-1/3 w-full flex space-x-1 p-4 justify-center">
                                    {list.movies.slice(0, 4).map((movie) => (
                                        <div
                                            key={movie.id}
                                            className="relative w-24 h-36 md:w-full md:h-48  md:mr-0"
                                        >
                                            {movie.poster_path ? (
                                                <img
                                                    src={`${image_url}/w200${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded">
                                                    <span className="text-sm text-gray-400">
                                                        No poster
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 flex-grow">
                                    <h2 className="text-xl font-bold mb-2">
                                        {list.name}
                                    </h2>
                                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                                        <span>{list.movies.length} films</span>
                                        {/* <span className="flex items-center">
                                            <Heart className="w-4 h-4 mr-1" />{" "}
                                            {list.likes || 0}
                                        </span> */}
                                        {/* <span className="flex items-center">
                                            <MessageSquare className="w-4 h-4 mr-1" />{" "}
                                            {list.comments || 0}
                                        </span> */}
                                    </div>
                                    {/* <div className="mb-4">
                                        <span className="font-bold">
                                            Average Rating:{" "}
                                            {list.averageRating
                                                ? list.averageRating.toFixed(1)
                                                : "N/A"}
                                        </span>
                                    </div> */}
                                    <p className="text-white">
                                        {`Description: ${list.description}` ||
                                            "No description available."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Drawer open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
                <CreateList onClose={handleCloseDrawer} />
            </Drawer>
        </div>
    )
}

export default UserLists
