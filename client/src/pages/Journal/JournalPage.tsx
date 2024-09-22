import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useJournal } from "@/services/journalService"
import { SimpleMovie } from "@/Types/Movie"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { searchMovies } from "@/services/movieService"

const JournalPage: React.FC = () => {
    const { useGetJournalEntries, useAddJournalEntry } = useJournal()
    const { data: journalEntries, isLoading } = useGetJournalEntries()
    const addJournalEntry = useAddJournalEntry()

    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SimpleMovie[]>([])
    const [selectedMovie, setSelectedMovie] = useState<SimpleMovie | null>(null)
    const [dateWatched, setDateWatched] = useState<Date | undefined>(new Date())
    const [rewatches, setRewatches] = useState(1)
    const [isAddingEntry, setIsAddingEntry] = useState(false)

    const handleAddEntry = async () => {
        if (!selectedMovie || !dateWatched) return

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

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="max-h-screen overflow-auto scrollbar-hide mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-white">
                My Movie Journal
            </h1>

            <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
                <DialogTrigger asChild>
                    <Button className="bg-background">Add New Entry</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Journal Entry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="movie-search ">Search Movie</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="movie-search"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        handleSearchMovie()
                                    }}
                                    placeholder="Enter movie title"
                                />
                            </div>
                            {searchResults.length > 0 && (
                                <ul className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                                    {searchResults.map((movie) => (
                                        <li
                                            key={movie.id}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() =>
                                                handleSelectMovie(movie)
                                            }
                                        >
                                            {movie.title} (
                                            {movie.release_date?.split("-")[0]})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {selectedMovie && (
                            <div>
                                <p>Selected Movie: {selectedMovie.title}</p>
                                <img
                                    src={`https://image.tmdb.org/t/p/w45${selectedMovie.poster_path}`}
                                    alt={selectedMovie.title}
                                />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="rewatches">Times Watched</Label>
                            <Input
                                id="rewatches"
                                type="number"
                                value={rewatches}
                                onChange={(e) =>
                                    setRewatches(parseInt(e.target.value))
                                }
                                min={1}
                            />
                        </div>
                        <div>
                            <Label>Date Watched</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal",
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
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dateWatched}
                                        onSelect={setDateWatched}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button onClick={handleAddEntry}>Add Entry</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {journalEntries?.map((entry) => (
                    <Card key={entry._id}>
                        <CardHeader>
                            <CardTitle>{entry.movie.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img
                                src={`https://image.tmdb.org/t/p/w92${entry.movie.poster_path}`}
                                alt={entry.movie.title}
                                className=""
                            />
                            <p>
                                Date Watched:{" "}
                                {format(new Date(entry.dateWatched), "PPP")}
                            </p>
                            <p>Times Watched: {entry.rewatches}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default JournalPage
