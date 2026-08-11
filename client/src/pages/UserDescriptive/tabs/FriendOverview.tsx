import { FriendCard } from "../components/FriendCard"
import { genreMap } from "@/lib/stats"
import { config } from "@/lib/config"
import type { SimpleMovie } from "@/Types/Movie"
import { formatDistanceToNow } from "date-fns"
import { Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

const IMAGE_URL = config.tmdb.imageBaseUrl

export type FriendJournalEntry = {
    _id: string
    movie: SimpleMovie
    dateWatched: string | Date
    rewatches?: number
    rating?: number
}

export type FriendList = {
    list_id: string
    name: string
    movies: { movie_id: string; id?: string }[]
}

type FriendOverviewProps = {
    userName: string
    lists: FriendList[]
    previewMovies: SimpleMovie[]
    previewList: FriendList | null
    journalEntries: FriendJournalEntry[]
    filmsThisYear: number
    totalWatched: number
    topGenre: string
    onOpenListsTab: () => void
    onOpenJournalTab: () => void
}

function genreLabel(ids?: number[]) {
    if (!ids?.length) return null
    return ids
        .slice(0, 2)
        .map((id) => genreMap[id])
        .filter(Boolean)
        .join(", ")
}

function StarRating({ rating }: { rating: number }) {
    const filled = Math.round(rating)
    return (
        <span className="inline-flex items-center gap-0.5" aria-label={`${rating} of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                        i < filled
                            ? "fill-warning text-warning"
                            : "text-muted-foreground/40"
                    }`}
                />
            ))}
        </span>
    )
}

export default function FriendOverview({
    userName,
    previewMovies,
    previewList,
    journalEntries,
    filmsThisYear,
    totalWatched,
    topGenre,
    onOpenListsTab,
    onOpenJournalTab,
}: FriendOverviewProps) {
    const navigate = useNavigate()
    const recentEntries = [...journalEntries]
        .sort(
            (a, b) =>
                new Date(b.dateWatched).getTime() -
                new Date(a.dateWatched).getTime()
        )
        .slice(0, 5)

    const listTitle = previewList?.name
        ? `${previewList.name} Preview`
        : "Lists Preview"

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
            <div className="flex flex-col gap-5">
                <FriendCard title={listTitle} onTitleClick={onOpenListsTab}>
                    {previewMovies.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No movies in this list yet.
                        </p>
                    ) : (
                        <ul className="divide-y divide-border/60">
                            {previewMovies.slice(0, 5).map((movie) => {
                                const year = movie.release_date
                                    ? new Date(movie.release_date).getFullYear()
                                    : null
                                const genres = genreLabel(movie.genre_ids)
                                return (
                                    <li key={movie.id || movie.movie_id}>
                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-surface/40"
                                            onClick={() =>
                                                navigate(
                                                    `/movie/${movie.id || movie.movie_id}`
                                                )
                                            }
                                        >
                                            {movie.poster_path ? (
                                                <img
                                                    src={`${IMAGE_URL}/w92${movie.poster_path}`}
                                                    alt=""
                                                    className="h-14 w-10 shrink-0 rounded-[2px] object-cover"
                                                />
                                            ) : (
                                                <div className="h-14 w-10 shrink-0 rounded-[2px] bg-surface" />
                                            )}
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-foreground">
                                                    {movie.title}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {[year, genres]
                                                        .filter(Boolean)
                                                        .join(" • ")}
                                                </p>
                                            </div>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                    {previewList ? (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/list/${previewList.list_id}`)
                            }
                            className="mt-4 w-full rounded-[4px] border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:border-electric hover:text-electric"
                        >
                            View Full List
                        </button>
                    ) : null}
                </FriendCard>

                <FriendCard
                    title="Recent Activity"
                    onTitleClick={onOpenJournalTab}
                >
                    {recentEntries.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No recent journal activity.
                        </p>
                    ) : (
                        <ol className="relative space-y-0 border-l border-border ml-2">
                            {recentEntries.map((entry) => {
                                const when = formatDistanceToNow(
                                    new Date(entry.dateWatched),
                                    { addSuffix: true }
                                )
                                return (
                                    <li
                                        key={entry._id}
                                        className="relative pb-5 pl-5 last:pb-0"
                                    >
                                        <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-electric ring-4 ring-card" />
                                        <p className="text-xs text-muted-foreground">
                                            {when}
                                        </p>
                                        <p className="mt-0.5 text-sm text-foreground">
                                            Logged{" "}
                                            <button
                                                type="button"
                                                className="font-medium text-electric hover:underline"
                                                onClick={() =>
                                                    navigate(
                                                        `/movie/${entry.movie.id || entry.movie.movie_id}`
                                                    )
                                                }
                                            >
                                                {entry.movie.title}
                                            </button>
                                            {entry.rating != null &&
                                            entry.rating > 0 ? (
                                                <span className="ml-2 inline-flex align-middle">
                                                    <StarRating
                                                        rating={entry.rating}
                                                    />
                                                </span>
                                            ) : null}
                                        </p>
                                    </li>
                                )
                            })}
                        </ol>
                    )}
                </FriendCard>
            </div>

            <FriendCard title="Quick Stats">
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-[4px] border border-border bg-surface/40 px-3 py-4 text-center">
                            <p className="text-2xl font-bold text-foreground">
                                {filmsThisYear}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Films This Year
                            </p>
                        </div>
                        <div className="rounded-[4px] border border-border bg-surface/40 px-3 py-4 text-center">
                            <p className="text-2xl font-bold text-foreground">
                                {totalWatched}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Total Watched
                            </p>
                        </div>
                    </div>
                    <div className="rounded-[4px] border border-border bg-surface/40 px-3 py-4 text-center">
                        <p className="text-xl font-bold text-foreground">
                            {topGenre || "—"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Top Genre
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate(`/stats/${userName}`)}
                        className="mt-1 text-sm text-electric hover:underline"
                    >
                        View full stats →
                    </button>
                </div>
            </FriendCard>
        </div>
    )
}
