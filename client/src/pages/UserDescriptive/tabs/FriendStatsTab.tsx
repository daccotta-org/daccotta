import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function FriendStatsTab({
    userName,
    filmsThisYear,
    totalWatched,
    topGenre,
}: {
    userName: string
    filmsThisYear: number
    totalWatched: number
    topGenre: string
}) {
    const navigate = useNavigate()

    return (
        <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[4px] border border-border bg-card px-4 py-6 text-center">
                    <p className="text-3xl font-bold">{filmsThisYear}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Films This Year
                    </p>
                </div>
                <div className="rounded-[4px] border border-border bg-card px-4 py-6 text-center">
                    <p className="text-3xl font-bold">{totalWatched}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Total Watched
                    </p>
                </div>
                <div className="rounded-[4px] border border-border bg-card px-4 py-6 text-center">
                    <p className="text-3xl font-bold">{topGenre || "—"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Top Genre
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center rounded-[4px] border border-dashed border-border px-6 py-12 text-center">
                <BarChart3 className="mb-3 h-8 w-8 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Full stats page</h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Charts, genre breakdown, and monthly watching live on the
                    dedicated stats page for now.
                </p>
                <Button
                    className="mt-5"
                    onClick={() => navigate(`/stats/${userName}`)}
                >
                    Open full stats
                </Button>
            </div>
        </div>
    )
}
