import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import FullPageLoader from "@/components/ui/FullPageLoader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateStats } from "@/lib/stats"
import { useFriends } from "@/services/friendsService"
import { useJournal } from "@/services/journalService"
import { fetchMoviesByIds } from "@/services/movieService"
import { SimpleMovie } from "@/Types/Movie"
import { AlertTriangle, Award, List, Users } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import FriendOverview, {
    FriendJournalEntry,
    FriendList,
} from "./tabs/FriendOverview"
import FriendListsTab from "./tabs/FriendListsTab"
import FriendStatsTab from "./tabs/FriendStatsTab"
import FriendJournalTab from "./tabs/FriendJournalTab"

type FriendTab = "overview" | "lists" | "stats" | "journal"

function pickPreviewList(lists: FriendList[]): FriendList | null {
    if (!lists.length) return null
    const byName =
        lists.find((l) => /top\s*5/i.test(l.name)) ||
        lists.find((l) => /favorite|favourite|top/i.test(l.name))
    return byName || lists[0]
}

const UserDescriptivePage: React.FC = () => {
    const { userName } = useParams<{ userName: string }>()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<FriendTab>("overview")
    const [previewMovies, setPreviewMovies] = useState<SimpleMovie[]>([])
    const [isRemoveOpen, setIsRemoveOpen] = useState(false)
    const [removeLoading, setRemoveLoading] = useState(false)

    const { useGetFriendData, useGetFriends, useRemoveFriend } = useFriends()
    const {
        data: userData,
        isLoading,
        error,
    } = useGetFriendData(userName || "")
    const { data: friendsData } = useGetFriends({ page: 1, limit: 100 })
    const removeFriendMutation = useRemoveFriend()

    const { useGetFriendJournalEntries } = useJournal()
    const { data: journalEntries = [], isLoading: isJournalLoading } =
        useGetFriendJournalEntries(userName || "")

    const lists: FriendList[] = userData?.lists ?? []
    const previewList = useMemo(() => pickPreviewList(lists), [lists])

    const entries = journalEntries as FriendJournalEntry[]
    const stats = useMemo(
        () => (entries.length ? calculateStats(entries as any) : null),
        [entries]
    )

    const filmsThisYear = useMemo(() => {
        const year = new Date().getFullYear()
        return entries.filter(
            (e) => new Date(e.dateWatched).getFullYear() === year
        ).length
    }, [entries])

    const totalWatched = stats?.totalWatched ?? entries.length
    const topGenre = stats?.topGenres?.[0]?.genre ?? ""

    const isFriend = Boolean(
        userName && friendsData?.friends?.includes(userName)
    )

    useEffect(() => {
        const loadPreview = async () => {
            if (!previewList?.movies?.length) {
                setPreviewMovies([])
                return
            }
            try {
                const ids = previewList.movies
                    .map((m) => m.movie_id)
                    .filter(Boolean)
                    .slice(0, 5)
                const movies = await fetchMoviesByIds(ids)
                setPreviewMovies(movies)
            } catch (err) {
                console.error("Error fetching preview movies:", err)
                setPreviewMovies([])
            }
        }
        loadPreview()
    }, [previewList])

    const handleRemoveFriend = () => {
        if (!userName) return
        setRemoveLoading(true)
        removeFriendMutation.mutate(userName, {
            onSuccess: () => {
                toast.success("Friend removed successfully.")
                setIsRemoveOpen(false)
                navigate("/friends")
            },
            onError: () => {
                toast.error("Failed to remove friend. Please try again.")
            },
            onSettled: () => setRemoveLoading(false),
        })
    }

    if (isLoading || isJournalLoading) {
        return <FullPageLoader message="Loading profile..." />
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center text-muted-foreground">
                Error loading user data
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="flex min-h-screen items-center justify-center text-muted-foreground">
                User not found
            </div>
        )
    }

    return (
        <div className="min-h-screen max-h-screen w-full overflow-auto bg-background px-6 py-8 text-foreground scrollbar-hide md:px-10 md:py-10 lg:px-14">
            <div className="mx-auto w-full max-w-6xl">
                {/* Profile header */}
                <header className="mb-8 flex flex-wrap items-start justify-between gap-5">
                    <div className="flex min-w-0 items-start gap-4 md:gap-5">
                        <Avatar className="h-20 w-20 shrink-0 rounded-[4px] md:h-24 md:w-24">
                            <AvatarImage
                                src={
                                    userData.profile_image ||
                                    `/api/avatar/${userData.userName}`
                                }
                                alt={userData.userName}
                                className="rounded-[4px] object-cover"
                            />
                            <AvatarFallback className="rounded-[4px] bg-surface font-heading text-lg">
                                {userData.userName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 pt-1">
                            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
                                {userData.userName}
                            </h1>
                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5 text-electric" />
                                    {userData.friends?.length ?? 0} Friends
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <List className="h-3.5 w-3.5 text-electric" />
                                    {lists.length} Lists
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Award className="h-3.5 w-3.5 text-warning" />
                                    {userData.badges?.length ?? 0} Badges
                                </span>
                            </div>
                        </div>
                    </div>

                    {isFriend ? (
                        <Button
                            variant="outline"
                            className="shrink-0"
                            onClick={() => setIsRemoveOpen(true)}
                        >
                            Unfriend
                        </Button>
                    ) : null}
                </header>

                <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as FriendTab)}
                >
                    <TabsList className="mb-6 gap-6">
                        <TabsTrigger value="overview" className="px-0">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="lists" className="px-0">
                            Lists
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="px-0">
                            Stats
                        </TabsTrigger>
                        <TabsTrigger value="journal" className="px-0">
                            Journal
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-0">
                        <FriendOverview
                            userName={userData.userName}
                            lists={lists}
                            previewMovies={previewMovies}
                            previewList={previewList}
                            journalEntries={entries}
                            filmsThisYear={filmsThisYear}
                            totalWatched={totalWatched}
                            topGenre={topGenre}
                            onOpenListsTab={() => setActiveTab("lists")}
                            onOpenJournalTab={() => setActiveTab("journal")}
                        />
                    </TabsContent>

                    <TabsContent value="lists" className="mt-0">
                        <FriendListsTab lists={lists} />
                    </TabsContent>

                    <TabsContent value="stats" className="mt-0">
                        <FriendStatsTab
                            userName={userData.userName}
                            filmsThisYear={filmsThisYear}
                            totalWatched={totalWatched}
                            topGenre={topGenre}
                        />
                    </TabsContent>

                    <TabsContent value="journal" className="mt-0">
                        <FriendJournalTab entries={entries} />
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={isRemoveOpen} onOpenChange={setIsRemoveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-heading">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                            Remove Friend
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to remove{" "}
                        <span className="font-medium text-foreground">
                            {userData.userName}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRemoveOpen(false)}
                            disabled={removeLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRemoveFriend}
                            disabled={removeLoading}
                        >
                            {removeLoading ? "Removing..." : "Remove Friend"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UserDescriptivePage
