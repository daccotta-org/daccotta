// import React, { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { useAuth } from "@/hooks/useAuth"
// import { getUserData } from "@/services/userService"
// import { Plus, ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
// import { toast } from "react-toastify"
// import CreateList from "../CreateList/CreateList" // Reusing CreateList component
// import { Drawer } from "@/components/ui/drawer" // Reusing Drawer component

// interface List {
//     list_id: string
//     name: string
//     movies: { movie_id: string; id: string }[]
// }

// interface UserData {
//     lists: List[]
// }

// const UserLists: React.FC = () => {
//     const [lists, setLists] = useState<List[]>([])
//     const [isCreateListOpen, setIsCreateListOpen] = useState(false)
//     const { user } = useAuth()
//     const navigate = useNavigate()

//     useEffect(() => {
//         const fetchLists = async () => {
//             if (user?.uid) {
//                 try {
//                     const userData: UserData = await getUserData(user.uid)
//                     setLists(userData.lists)
//                 } catch (error) {
//                     console.error("Error fetching user lists:", error)
//                     toast.error("Failed to fetch your lists. Please try again.")
//                 }
//             }
//         }

//         fetchLists()
//     }, [user])

//     const handleListClick = (listId: string) => {
//         navigate(`/list/${listId}`)
//     }

//     const handleCreateList = () => {
//         setIsCreateListOpen(true) // Open the drawer
//     }

//     const handleCloseDrawer = () => {
//         setIsCreateListOpen(false) // Close drawer without creating a list
//     }

//     return (
//         <div className="w-full max-h-screen overflow-auto scrollbar-hide py-6  px-12 ">
//             <div className="w-full h-full flex lg:flex-row flex-col gap-1 justify-start items-start mb-6">
//                 <h1 className="text-3xl font-bold mr-2 text-white">
//                     Your Movie Lists
//                 </h1>
//                 <Dialog
//                     open={isCreateListOpen}
//                     onOpenChange={setIsCreateListOpen}
//                 >
//                     <DialogTrigger asChild>
//                         <Button
//                             variant="outline"
//                             className="rounded-full"
//                             onClick={handleCreateList}
//                         >
//                             <Plus className="h-5 w-5 mr-2" />
//                             <span className="text-white">New List</span>
//                         </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                         {/* <CreateList onListCreated={handleListCreated} /> */}
//                         <h1>create a list</h1>
//                     </DialogContent>
//                 </Dialog>
//             </div>
//             <div className="space-y-4">
//                 {lists.map((list) => (
//                     <Card
//                         key={list.list_id}
//                         className="hover:bg-accent transition-colors bg-gradient-to-br from-gray-900 to-gray-800 border-0 cursor-pointer"
//                         onClick={() => handleListClick(list.list_id)}
//                     >
//                         <CardContent className="flex items-center justify-between p-4">
//                             <div>
//                                 <h2 className="text-xl font-semibold">
//                                     {list.name}
//                                 </h2>
//                                 <p className="text-sm text-gray-400">
//                                     {list.movies.length} movies
//                                 </p>
//                             </div>
//                             <ChevronRight className="h-5 w-5 text-gray-400 hover:translate-x-1 transition duration-500" />
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//             <Drawer open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
//                 <CreateList onClose={handleCloseDrawer} />
//             </Drawer>
//         </div>
//     )
// }

// export default UserLists

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getUserData } from "@/services/userService"
import { Plus, ChevronRight, Heart, MessageSquare, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import CreateList from "../CreateList/CreateList"
import { Drawer } from "@/components/ui/drawer"
import LazyImage from "@/components/custom/LazyLoadImage/LazyImage"

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
                        {/* <span>Sort by WHEN UPDATED</span>
                        <Eye className="w-5 h-5" /> */}
                    </div>
                </header>
                <div className="space-y-8">
                    {lists.map((list) => (
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
                                        <span className="flex items-center">
                                            <Heart className="w-4 h-4 mr-1" />{" "}
                                            {list.likes || 0}
                                        </span>
                                        <span className="flex items-center">
                                            <MessageSquare className="w-4 h-4 mr-1" />{" "}
                                            {list.comments || 0}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <span className="font-bold">
                                            Average Rating:{" "}
                                            {list.averageRating
                                                ? list.averageRating.toFixed(1)
                                                : "N/A"}
                                        </span>
                                    </div>
                                    <p className="text-gray-400">
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
