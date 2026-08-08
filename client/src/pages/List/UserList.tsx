import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { fetchMovieToList } from "@/services/userService"
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import CreateList from "../CreateList/CreateList"
import { Drawer } from "@/components/ui/drawer"
import { Trash } from "lucide-react"
import { deleteList } from "@/services/userService"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"

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

const image_url = "https://image.tmdb.org/t/p"

const UserLists: React.FC = () => {
    // const [lists, setLists] = useState<List[]>([])
    const [isCreateListOpen, setIsCreateListOpen] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [pagination, setPagination] = useState<{
        page: number;
        limit: number;
        totalPages: number;
    }>({
        page: 1, 
        limit: 5,
        totalPages: 1
    });

    const fetchLists = async () => {
        if (user?.uid) {
            try {
                const listData: any = await fetchMovieToList(user.uid, pagination.page, pagination.limit);
                return listData;
            } catch (error) {
                console.error("Error fetching user lists:", error)
                toast.error("Failed to fetch your lists. Please try again.")
            }
        }
    }

    const {data: lists, isLoading: listIsLoading, refetch: refetchList} = useQuery({queryKey: ["lists"], queryFn: fetchLists});

    useEffect(() => {
        refetchList();
    }, [pagination])

    useEffect(() => {
        if(lists?.meta[0]) {
            setPagination((prev) => ({
                ...prev,
                totalPages: lists?.meta[0]?.totalPages ?? prev.page,
            }));
        }
    }, [lists]);

    if(listIsLoading) return <>Loading...</> 

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
        setSearchQuery(e.target.value)
    }

    const filteredLists = lists.data[0].lists.filter((lists : any) =>
        lists.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDeleteList = async (listId: string) => {
        console.log("list id", listId)
        try {
            // Call your delete service or API here
            await deleteList(listId) // Assuming deleteList is your API call
            refetchList()
            toast.success("List deleted successfully")
        } catch (error) {
            console.error("Error deleting list:", error)
            toast.error("Failed to delete the list. Please try again.")
        }
    }  
    
    // pagination section methods and variables
    const _limit = [5, 15, 25, 50, 75];

    const handleLimitSelect = (limit: number) => {
        setPagination(prev => ({
            ...prev,
            limit
        }));
    }

    return (
        <div className="w-full max-h-screen overflow-auto scrollbar-hide text-foreground min-h-screen p-4 md:p-8 bg-background">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-end mb-10 gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-electric mb-2">
                            Your Collections
                        </p>
                        <h1 className="font-heading text-4xl font-bold tracking-tight">
                            Lists
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuLabel className="text-muted-foreground">
                                Row:
                            </DropdownMenuLabel>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-fit">
                                        {pagination.limit || "Row Limit"}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                                {
                                    _limit.map((lim, index) => (
                                        <DropdownMenuItem
                                            key={`${lim}-${index}`}
                                            onClick={() => handleLimitSelect(lim)}
                                            >
                                            {lim}
                                        </DropdownMenuItem>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            onClick={handleCreateList}
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            New List
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleSearchToggle}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>
                </header>
                <div className="h-px bg-border mb-8" />
                <div className="space-y-6">
                    {isSearchVisible && (
                        <div className="mt-4 w-full">
                            <Input
                                type="text"
                                placeholder="Search lists..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-5 pr-5 py-2"
                            />
                        </div>
                    )}
                    {filteredLists.map((list: List) => (
                        <div
                            key={list.list_id}
                            className="relative bg-card border border-border rounded-[4px] overflow-hidden cursor-pointer transition-colors hover:border-muted-foreground/40"
                            onClick={() => handleListClick(list.list_id)}
                        >
                            <div className="absolute top-3 right-3 z-10">
                                {list.name !== "Top 5 Movies" &&
                                    list.name !== "Favourites" &&
                                    list.name !== "WatchList" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteList(list.list_id)
                                            }}
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    )}
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <div className="flex-shrink-0 md:w-1/3 w-full flex space-x-1 p-4 justify-center">
                                    {list.movies.slice(0, 4).map((movie) => (
                                        <div
                                            key={movie.id}
                                            className="relative w-24 h-36 md:w-full md:h-48  md:mr-0 rounded-[4px] overflow-hidden"
                                        >
                                            {movie.poster_path ? (
                                                <img
                                                    src={`${image_url}/w200${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-surface flex items-center justify-center border border-border">
                                                    <span className="text-sm text-muted-foreground">
                                                        No poster
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 md:p-6 flex-grow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-[10px] uppercase tracking-wider border border-primary/60 text-primary px-2 py-0.5 rounded-[4px]">
                                            Collection
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wider text-warning border border-warning/40 px-2 py-0.5 rounded-[4px]">
                                            {list.movies.length} items
                                        </span>
                                    </div>
                                    <h2 className="font-heading text-xl font-bold mb-2">
                                        {list.name}
                                    </h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {list.description ||
                                            "No description available."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button 
                                    onClick={() => (
                                        setPagination((prev) => ({
                                            ...prev,
                                            page: prev.page - 1
                                        }))
                                    )}
                                    disabled={pagination.page === 1}
                                >
                                    <ChevronLeft className="w-5 h-5"/>
                                    Previous
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button 
                                    onClick={() => 
                                        setPagination((prev) => ({
                                            ...prev,
                                            page: prev.page + 1
                                        }))
                                    }   
                                    disabled={pagination.totalPages === pagination.page}     
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5"/>
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
            <Drawer open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
                <CreateList onClose={handleCloseDrawer} />
            </Drawer>
        </div>
    )
}

export default UserLists
