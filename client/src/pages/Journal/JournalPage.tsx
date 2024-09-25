import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useJournal } from "@/services/journalService"
import { SimpleMovie } from "@/Types/Movie"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { searchMovies } from "@/services/movieService"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const JournalPage: React.FC = () => {
    const { useGetJournalEntries, useAddJournalEntry } = useJournal()
    const { data: journalEntries, isLoading } = useGetJournalEntries()
    const addJournalEntry = useAddJournalEntry()
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SimpleMovie[]>([])
    const [selectedMovie, setSelectedMovie] = useState<SimpleMovie | null>(null)
    const [dateWatched, setDateWatched] = useState<Date | undefined>(new Date())
    const [rewatches, setRewatches] = useState(1)
    const [isAddingEntry, setIsAddingEntry] = useState(false)
    const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)

    const handleAddEntry = async () => {
        if (!selectedMovie || !dateWatched) return

        console.log("Adding entry:", { selectedMovie, rewatches, dateWatched })

        try {
            await addJournalEntry.mutateAsync({
                movie: {
                    movie_id: selectedMovie.id,
                    id: selectedMovie.id,
                    title: selectedMovie.title,
                    poster_path: selectedMovie.poster_path,
                    release_date: selectedMovie.release_date,
                    genre_ids: selectedMovie.genre_ids,
                },
                dateWatched,
                rewatches,
            })

            setIsAddingEntry(false)
            setSelectedMovie(null)
            setDateWatched(new Date())
            setRewatches(1)
            toast.success(
                `"${selectedMovie.title}" has been added to your journal.`
            )
        } catch (error) {
            console.error("Error adding journal entry:", error)
            toast.error("Failed to add journal entry. Please try again.")
        }
    }

    const handleSearchMovie = async () => {
        if (searchQuery.length >= 3) {
            const results = await searchMovies(searchQuery)
            setSearchResults(results)
        } else {
            setSearchResults([])
        }
    }

    const handleSelectMovie = (movie: SimpleMovie) => {
        setSelectedMovie(movie)
        setSearchResults([])
        setSearchQuery("")
    }

    const handleClick = (_id: string) => {
        navigate(`/movie/${_id}`)
    }

    const sortedEntries = useMemo(() => {
        if (!journalEntries) return []

        const sorted = [...journalEntries].sort(
            (a, b) =>
                new Date(b.dateWatched).getTime() -
                new Date(a.dateWatched).getTime()
        )

        const groupedByMonth: { [key: string]: typeof journalEntries } = {}
        sorted.forEach((entry) => {
            const monthYear = format(new Date(entry.dateWatched), "MMMM yyyy")
            if (!groupedByMonth[monthYear]) {
                groupedByMonth[monthYear] = []
            }
            groupedByMonth[monthYear].push(entry)
        })

        return groupedByMonth
    }, [journalEntries])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen text-white p-8 max-h-screen overflow-auto scrollbar-hide w-full">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between w-full items-center mb-6">
                    <h1 className="text-4xl font-bold">My Movie Journal</h1>
                    <Dialog
                        open={isAddingEntry}
                        onOpenChange={setIsAddingEntry}
                    >
                        <DialogTrigger asChild>
                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full w-10 h-10"
                            >
                                <Plus className="h-6 w-6" />
                                <span className="sr-only text-white">
                                    Add journal entry
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className=" xs:w-[400px] sm:max-w-[400px] max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl text-white font-bold">
                                    Add New Journal Entry
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    {/* <Label
                                        htmlFor="movie-search"
                                        className="text-sm font-medium"
                                    >
                                        Search Movie
                                    </Label> */}
                                    <div className="flex space-x-2">
                                        <Input
                                            id="movie-search"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value)
                                                handleSearchMovie()
                                            }}
                                            placeholder="Enter movie title"
                                            className="flex-grow"
                                        />
                                        {/* <Button
                                            onClick={handleSearchMovie}
                                            className="shrink-0"
                                        >
                                            Search
                                        </Button> */}
                                    </div>
                                    {searchResults.length > 0 && (
                                        <ul className="mt-2 border rounded-md max-h-40 overflow-y-auto bg-background">
                                            {searchResults.map((movie) => (
                                                <li
                                                    key={movie.id}
                                                    className="p-2 hover:bg-muted cursor-pointer transition-colors"
                                                    onClick={() =>
                                                        handleSelectMovie(movie)
                                                    }
                                                >
                                                    {movie.title} (
                                                    {
                                                        movie.release_date?.split(
                                                            "-"
                                                        )[0]
                                                    }
                                                    )
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {selectedMovie && (
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}`}
                                                alt={selectedMovie.title}
                                                className="w-10 h-auto rounded"
                                            />
                                            <div className="flex flex-row">
                                                <h3 className="font-semibold mb-2">
                                                    {/* Selected Movie:{" "} */}
                                                    {selectedMovie.title}
                                                    <p className="text-sm text-muted-foreground">
                                                        {/* Release Year:{" "} */}
                                                        {
                                                            selectedMovie.release_date?.split(
                                                                "-"
                                                            )[0]
                                                        }
                                                    </p>
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2 text-gray-300">
                                    <Label
                                        htmlFor="rewatches"
                                        className="text-sm   font-medium"
                                    >
                                        Times Watched
                                    </Label>
                                    <Input
                                        id="rewatches"
                                        type="number"
                                        value={rewatches}
                                        onChange={(e) =>
                                            setRewatches(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        min={1}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm text-gray-300 font-medium">
                                        Date Watched
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !dateWatched &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dateWatched ? (
                                                    format(dateWatched, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={dateWatched}
                                                onSelect={setDateWatched}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <Button
                                    onClick={handleAddEntry}
                                    className="w-full"
                                >
                                    Add Entry
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                {Object.entries(sortedEntries).map(([monthYear, entries]) => (
                    <div key={monthYear} className="mb-8">
                        <h2 className="text-xl underline font-semibold mb-4">
                            {monthYear}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {entries.map((entry) => (
                                <div
                                    key={entry._id}
                                    className="relative w-full h-full"
                                    onMouseEnter={() =>
                                        setHoveredEntry(entry._id)
                                    }
                                    onMouseLeave={() => setHoveredEntry(null)}
                                    onClick={() =>
                                        handleClick(entry.movie.movie_id)
                                    }
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${entry.movie.poster_path}`}
                                        alt={`${entry.movie.title} poster`}
                                        className="w-full h-full rounded-lg shadow-lg"
                                    />
                                    {hoveredEntry === entry._id && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                        >
                                            <h3 className="text-lg font-bold">
                                                {entry.movie.title}
                                            </h3>
                                            <p className="text-sm text-gray-300">
                                                Watched:{" "}
                                                {format(
                                                    new Date(entry.dateWatched),
                                                    "PPP"
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-300">
                                                Times Watched: {entry.rewatches}
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <Card className="overflow-hidden border-dashed w-[200px]">
                    <CardContent className="p-0 flex items-center justify-center h-[300px]">
                        <div
                            className="text-center p-4 cursor-pointer"
                            onClick={() => setIsAddingEntry(true)}
                        >
                            <Plus className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                                Add Journal Entry
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default JournalPage
