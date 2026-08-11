import type { FriendJournalEntry } from "./FriendOverview"
import { config } from "@/lib/config"
import { format } from "date-fns"
import { BookOpen, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

const IMAGE_URL = config.tmdb.imageBaseUrl

export default function FriendJournalTab({
    entries,
}: {
    entries: FriendJournalEntry[]
}) {
    const navigate = useNavigate()
    const sorted = [...entries].sort(
        (a, b) =>
            new Date(b.dateWatched).getTime() -
            new Date(a.dateWatched).getTime()
    )

    if (!sorted.length) {
        return (
            <div className="rounded-[4px] border border-dashed border-border px-6 py-16 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No journal entries</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    This user hasn’t logged any movies yet.
                </p>
            </div>
        )
    }

    return (
        <ul className="divide-y divide-border rounded-[4px] border border-border bg-card">
            {sorted.map((entry) => (
                <li key={entry._id}>
                    <button
                        type="button"
                        className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-surface/40"
                        onClick={() =>
                            navigate(
                                `/movie/${entry.movie.id || entry.movie.movie_id}`
                            )
                        }
                    >
                        {entry.movie.poster_path ? (
                            <img
                                src={`${IMAGE_URL}/w92${entry.movie.poster_path}`}
                                alt=""
                                className="h-16 w-11 shrink-0 rounded-[2px] object-cover"
                            />
                        ) : (
                            <div className="h-16 w-11 shrink-0 rounded-[2px] bg-surface" />
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">
                                {entry.movie.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {format(
                                    new Date(entry.dateWatched),
                                    "MMM d, yyyy"
                                )}
                            </p>
                        </div>
                        {entry.rating != null && entry.rating > 0 ? (
                            <span className="inline-flex shrink-0 items-center gap-1 text-sm text-warning">
                                <Star className="h-3.5 w-3.5 fill-warning" />
                                {entry.rating}
                            </span>
                        ) : null}
                    </button>
                </li>
            ))}
        </ul>
    )
}
