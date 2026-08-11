import type { FriendList } from "./FriendOverview"
import { useNavigate } from "react-router-dom"
import { List } from "lucide-react"

export default function FriendListsTab({ lists }: { lists: FriendList[] }) {
    const navigate = useNavigate()

    if (!lists.length) {
        return (
            <div className="rounded-[4px] border border-dashed border-border px-6 py-16 text-center">
                <List className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No lists yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    This user hasn’t created any public lists.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
                <button
                    key={list.list_id}
                    type="button"
                    onClick={() => navigate(`/list/${list.list_id}`)}
                    className="rounded-[4px] border border-border bg-card p-5 text-left transition-colors hover:border-electric/60 hover:bg-surface/40"
                >
                    <h3 className="font-semibold text-foreground">{list.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {list.movies?.length ?? 0}{" "}
                        {(list.movies?.length ?? 0) === 1 ? "movie" : "movies"}
                    </p>
                </button>
            ))}
        </div>
    )
}
