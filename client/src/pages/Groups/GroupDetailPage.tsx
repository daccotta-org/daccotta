import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import {
    ArrowLeft,
    Clapperboard,
    Plus,
    Trash2,
    UserMinus,
    UserPlus,
    Shield,
} from "lucide-react"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import FullPageLoader from "@/components/ui/FullPageLoader"
import { useAuth } from "@/hooks/useAuth"
import { useFriends } from "@/services/friendsService"
import { useGroups } from "@/services/groupsService"
import { useGetRecommendedMovies } from "@/services/movieService"
import type { GroupActivityItem, GroupSummary } from "@/Types/Group"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { config } from "@/lib/config"

const IMAGE_URL = config.tmdb.imageBaseUrl

const createListSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(80),
    description: z.string().trim().max(500).optional(),
})

type CreateListForm = z.infer<typeof createListSchema>

function activityText(item: GroupActivityItem) {
    const who = item.actor.userName
    switch (item.action) {
        case "movie_added":
            return `${who} added ${item.meta.movie_title} to ${item.meta.list_name}`
        case "movie_removed":
            return `${who} removed ${item.meta.movie_title} from ${item.meta.list_name}`
        case "list_created":
            return `${who} created list ${item.meta.list_name}`
        case "list_deleted":
            return `${who} deleted list ${item.meta.list_name}`
        case "member_added":
            return `${who} added ${item.meta.target_username ?? "a member"}`
        case "member_removed":
            return `${who} removed a member`
        case "role_changed":
            return `${who} made a member ${item.meta.role}`
        default:
            return `${who} updated the group`
    }
}

function MembersPanel({
    group,
    isAdmin,
    currentUserId,
}: {
    group: GroupSummary
    isAdmin: boolean
    currentUserId: string
}) {
    const navigate = useNavigate()
    const { useAddMember, useRemoveMember, useUpdateMemberRole, getErrorMessage } =
        useGroups()
    const addMember = useAddMember(group.id)
    const removeMember = useRemoveMember(group.id)
    const updateRole = useUpdateMemberRole(group.id)
    const { useGetFriends } = useFriends()
    const { data: friendsData } = useGetFriends({ page: 1, limit: 100 })
    const friendList: string[] = friendsData?.friends ?? []

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [filter, setFilter] = useState("")

    const memberNames = useMemo(
        () => new Set(group.members.map((m) => m.userName).filter(Boolean)),
        [group.members]
    )

    const addableFriends = friendList.filter(
        (f) =>
            !memberNames.has(f) &&
            f.toLowerCase().includes(filter.trim().toLowerCase())
    )

    const adminCount = group.members.filter((m) => m.role === "admin").length

    const handleAdd = async (username: string) => {
        try {
            await addMember.mutateAsync(username)
            toast.success(`Added ${username}`)
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to add member"))
        }
    }

    const handleRemove = async (userId: string, label: string) => {
        try {
            await removeMember.mutateAsync(userId)
            toast.success(
                userId === currentUserId ? "Left group" : `Removed ${label}`
            )
            if (userId === currentUserId) {
                navigate("/groups")
            }
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to remove member"))
        }
    }

    const handleRole = async (userId: string, role: "admin" | "member") => {
        try {
            await updateRole.mutateAsync({ userId, role })
            toast.success(`Role updated to ${role}`)
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to update role"))
        }
    }

    return (
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Members</h3>
                {isAdmin ? (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAddOpen(true)}
                    >
                        <UserPlus className="mr-1 h-4 w-4" />
                        Add
                    </Button>
                ) : null}
            </div>
            <ul className="space-y-3">
                {group.members.map((m) => {
                    const isSelf = m.user_id === currentUserId
                    const isLastAdmin = m.role === "admin" && adminCount === 1
                    return (
                        <li
                            key={m.user_id}
                            className="flex items-center justify-between gap-2"
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={m.profile_image} />
                                    <AvatarFallback>
                                        {(m.userName ?? "?").slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {m.userName}
                                        {isSelf ? " (you)" : ""}
                                    </p>
                                    <p className="text-xs capitalize text-muted-foreground">
                                        {m.role}
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 gap-1">
                                {isAdmin && !isSelf ? (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        title={
                                            m.role === "admin"
                                                ? "Demote to member"
                                                : "Make admin"
                                        }
                                        onClick={() =>
                                            handleRole(
                                                m.user_id,
                                                m.role === "admin"
                                                    ? "member"
                                                    : "admin"
                                            )
                                        }
                                    >
                                        <Shield className="h-4 w-4" />
                                    </Button>
                                ) : null}
                                {(isAdmin && !isSelf) || isSelf ? (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        disabled={isLastAdmin && isSelf}
                                        title={
                                            isLastAdmin && isSelf
                                                ? "Promote another admin before leaving"
                                                : isSelf
                                                  ? "Leave group"
                                                  : "Remove member"
                                        }
                                        onClick={() =>
                                            handleRemove(
                                                m.user_id,
                                                m.userName ?? "member"
                                            )
                                        }
                                    >
                                        <UserMinus className="h-4 w-4" />
                                    </Button>
                                ) : null}
                            </div>
                        </li>
                    )
                })}
            </ul>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a friend</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Filter friends..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                        {!addableFriends.length ? (
                            <p className="text-sm text-muted-foreground">
                                No friends available to add.
                            </p>
                        ) : (
                            addableFriends.map((username) => (
                                <div
                                    key={username}
                                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                                >
                                    <span>{username}</span>
                                    <Button
                                        size="sm"
                                        disabled={addMember.isPending}
                                        onClick={() => handleAdd(username)}
                                    >
                                        Add
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default function GroupDetailPage() {
    const { groupId } = useParams<{ groupId: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const {
        useGetGroup,
        useGetGroupLists,
        useCreateGroupList,
        useDeleteGroupList,
        useGetActivity,
        useGetStats,
        useGetRecommendations,
        useDeleteGroup,
        getErrorMessage,
    } = useGroups()

    const { data: group, isLoading, error } = useGetGroup(groupId)
    const { data: listsData, isLoading: listsLoading } =
        useGetGroupLists(groupId)
    const { data: activity } = useGetActivity(groupId)
    const { data: statsData } = useGetStats(groupId)
    const { data: recs } = useGetRecommendations(groupId)
    const createList = useCreateGroupList(groupId!)
    const deleteList = useDeleteGroupList(groupId!)
    const deleteGroup = useDeleteGroup()

    const [isCreateListOpen, setIsCreateListOpen] = useState(false)
    const [listToDelete, setListToDelete] = useState<string | null>(null)

    const listForm = useForm<CreateListForm>({
        resolver: zodResolver(createListSchema),
        defaultValues: { name: "", description: "" },
    })

    const me = group?.members.find((m) => m.user_id === user?.uid)
    const isAdmin = me?.role === "admin"

    const discoverSeed = recs?.seeds
    const { data: tmdbRecs } = useGetRecommendedMovies(
        discoverSeed?.year,
        discoverSeed?.genreId
    )

    const chartConfig: ChartConfig = {
        count: { label: "Watched", color: "hsl(var(--chart-1))" },
    }

    if (isLoading || !groupId) {
        return <FullPageLoader message="Loading group..." />
    }

    if (error || !group) {
        return (
            <div className="p-8 text-white">
                Group not found or you don&apos;t have access.
            </div>
        )
    }

    const atListCap =
        (listsData?.limits.list_count ?? group.list_count) >=
        (listsData?.limits.max_lists ?? 15)

    const onCreateList = listForm.handleSubmit(async (values) => {
        try {
            const list = await createList.mutateAsync({
                name: values.name,
                description: values.description || undefined,
            })
            toast.success("List created")
            setIsCreateListOpen(false)
            listForm.reset()
            navigate(`/groups/${groupId}/lists/${list.list_id}`)
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to create list"))
        }
    })

    const confirmDeleteList = async () => {
        if (!listToDelete) return
        try {
            await deleteList.mutateAsync(listToDelete)
            toast.success("List deleted")
            setListToDelete(null)
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to delete list"))
        }
    }

    const handleDeleteGroup = async () => {
        if (!window.confirm("Delete this group permanently?")) return
        try {
            await deleteGroup.mutateAsync(group.id)
            toast.success("Group deleted")
            navigate("/groups")
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to delete group"))
        }
    }

    const recommendationMovies = [
        ...(recs?.memberFavorites ?? []),
        ...(recs?.discover?.length
            ? recs.discover
            : (tmdbRecs ?? []).map(
                  (m: {
                      id: string
                      title: string
                      poster_path: string
                      release_date?: string
                      genre_ids?: number[]
                  }) => ({
                      movie_id: m.id,
                      title: m.title,
                      poster_path: m.poster_path,
                      release_date: m.release_date,
                      genre_ids: m.genre_ids,
                  })
              )),
    ].slice(0, 16)

    return (
        <div className="min-h-screen w-full overflow-auto p-6 text-white scrollbar-hide md:p-8">
            <div className="mx-auto max-w-6xl">
                <button
                    type="button"
                    onClick={() => navigate("/groups")}
                    className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Groups
                </button>

                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{group.name}</h1>
                        {group.description ? (
                            <p className="mt-1 max-w-2xl text-muted-foreground">
                                {group.description}
                            </p>
                        ) : null}
                    </div>
                    {isAdmin ? (
                        <Button variant="destructive" onClick={handleDeleteGroup}>
                            Delete group
                        </Button>
                    ) : null}
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                    <div>
                        <Tabs defaultValue="lists">
                            <TabsList>
                                <TabsTrigger value="lists">Lists</TabsTrigger>
                                <TabsTrigger value="stats">Stats</TabsTrigger>
                                <TabsTrigger value="recommendations">
                                    Recommendations
                                </TabsTrigger>
                                <TabsTrigger value="outings">
                                    Outings
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="lists" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        {listsData?.limits.list_count ?? 0} /{" "}
                                        {listsData?.limits.max_lists ?? 15}{" "}
                                        lists
                                    </p>
                                    <Button
                                        size="sm"
                                        disabled={atListCap}
                                        onClick={() =>
                                            setIsCreateListOpen(true)
                                        }
                                    >
                                        <Plus className="mr-1 h-4 w-4" />
                                        New list
                                    </Button>
                                </div>

                                {activity && activity.length > 0 ? (
                                    <div className="rounded-md border border-border/60 bg-secondary/20 p-3">
                                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Recent activity
                                        </p>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            {activity.slice(0, 5).map((a) => (
                                                <li key={a.id}>
                                                    {activityText(a)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}

                                {listsLoading ? (
                                    <p>Loading lists...</p>
                                ) : !listsData?.lists.length ? (
                                    <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                                        No lists yet. Create one to start
                                        collecting movies.
                                    </div>
                                ) : (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {listsData.lists.map((list) => (
                                            <div
                                                key={list.list_id}
                                                className="group relative rounded-lg border border-border bg-secondary/40 p-4"
                                            >
                                                <button
                                                    type="button"
                                                    className="w-full text-left"
                                                    onClick={() =>
                                                        navigate(
                                                            `/groups/${groupId}/lists/${list.list_id}`
                                                        )
                                                    }
                                                >
                                                    <h3 className="font-semibold">
                                                        {list.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {list.movies.length}{" "}
                                                        movies
                                                    </p>
                                                </button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="absolute right-2 top-2 opacity-70 hover:opacity-100"
                                                    onClick={() =>
                                                        setListToDelete(
                                                            list.list_id
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="stats" className="space-y-6">
                                {!statsData ? (
                                    <p className="text-muted-foreground">
                                        Loading stats...
                                    </p>
                                ) : (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="rounded-lg border border-border p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Total watched
                                                </p>
                                                <p className="text-2xl font-bold">
                                                    {
                                                        statsData.stats
                                                            .totalWatched
                                                    }
                                                </p>
                                            </div>
                                            <div className="rounded-lg border border-border p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Top decade
                                                </p>
                                                <p className="text-2xl font-bold">
                                                    {
                                                        statsData.stats
                                                            .topDecade.decade
                                                    }
                                                </p>
                                            </div>
                                            <div className="rounded-lg border border-border p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Top genre
                                                </p>
                                                <p className="text-2xl font-bold">
                                                    {statsData.stats.topGenres[0]
                                                        ?.genre ?? "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="rounded-lg border border-border p-4">
                                            <h3 className="mb-3 font-semibold">
                                                Monthly watches
                                            </h3>
                                            <ChartContainer
                                                config={chartConfig}
                                                className="h-56 w-full"
                                            >
                                                <BarChart
                                                    data={
                                                        statsData.stats
                                                            .monthlyWatched
                                                    }
                                                >
                                                    <CartesianGrid
                                                        vertical={false}
                                                    />
                                                    <XAxis
                                                        dataKey="month"
                                                        tickLine={false}
                                                        axisLine={false}
                                                    />
                                                    <ChartTooltip
                                                        content={
                                                            <ChartTooltipContent />
                                                        }
                                                    />
                                                    <Bar
                                                        dataKey="count"
                                                        fill="var(--color-count)"
                                                        radius={4}
                                                    />
                                                </BarChart>
                                            </ChartContainer>
                                        </div>

                                        <div className="rounded-lg border border-border p-4">
                                            <h3 className="mb-3 font-semibold">
                                                Per member
                                            </h3>
                                            <ul className="space-y-2">
                                                {statsData.perMember.map(
                                                    (m) => (
                                                        <li
                                                            key={m.user_id}
                                                            className="flex justify-between text-sm"
                                                        >
                                                            <span>
                                                                {m.userName}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                {m.watched}{" "}
                                                                watched
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </TabsContent>

                            <TabsContent
                                value="recommendations"
                                className="space-y-4"
                            >
                                {recs?.topGenres?.length ? (
                                    <p className="text-sm text-muted-foreground">
                                        Based on group tastes:{" "}
                                        {recs.topGenres
                                            .map((g) => g.name)
                                            .join(", ")}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Add journal entries to unlock better
                                        recommendations.
                                    </p>
                                )}

                                {recs?.commonWatches?.length ? (
                                    <div>
                                        <h3 className="mb-2 font-semibold">
                                            Watched by multiple members
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                            {recs.commonWatches.map((m) => (
                                                <button
                                                    key={m.movie_id}
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/movie/${m.movie_id}`
                                                        )
                                                    }
                                                    className="text-left"
                                                >
                                                    <img
                                                        src={`${IMAGE_URL}/w185${m.poster_path}`}
                                                        alt={m.title}
                                                        className="aspect-[2/3] w-full rounded-md object-cover"
                                                    />
                                                    <p className="mt-1 line-clamp-2 text-xs">
                                                        {m.title}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Suggested for the group
                                    </h3>
                                    {!recommendationMovies.length ? (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clapperboard className="h-5 w-5" />
                                            Not enough watch history yet.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                            {recommendationMovies.map((m) => (
                                                <button
                                                    key={m.movie_id}
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/movie/${m.movie_id}`
                                                        )
                                                    }
                                                    className="text-left"
                                                >
                                                    {m.poster_path ? (
                                                        <img
                                                            src={`${IMAGE_URL}/w185${m.poster_path}`}
                                                            alt={m.title}
                                                            className="aspect-[2/3] w-full rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="aspect-[2/3] rounded-md bg-secondary" />
                                                    )}
                                                    <p className="mt-1 line-clamp-2 text-xs">
                                                        {m.title}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="outings">
                                <div className="rounded-lg border border-dashed border-border p-10 text-center">
                                    <h3 className="text-xl font-semibold">
                                        Movie outings
                                    </h3>
                                    <p className="mt-2 text-muted-foreground">
                                        Plan theatre nights and hangouts here.
                                        Coming soon.
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <MembersPanel
                        group={group}
                        isAdmin={!!isAdmin}
                        currentUserId={user?.uid ?? ""}
                    />
                </div>
            </div>

            <Drawer open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
                <DrawerContent>
                    <form
                        onSubmit={onCreateList}
                        className="mx-auto w-full max-w-sm"
                    >
                        <DrawerHeader>
                            <DrawerTitle>New group list</DrawerTitle>
                            <DrawerDescription>
                                Up to {listsData?.limits.max_lists ?? 15} lists
                                per group.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="space-y-4 p-4 pb-0">
                            <div className="space-y-2">
                                <Label htmlFor="list-name">Name</Label>
                                <Input
                                    id="list-name"
                                    {...listForm.register("name")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="list-desc">Description</Label>
                                <Textarea
                                    id="list-desc"
                                    {...listForm.register("description")}
                                />
                            </div>
                        </div>
                        <DrawerFooter>
                            <Button
                                type="submit"
                                disabled={createList.isPending}
                            >
                                Create list
                            </Button>
                            <DrawerClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            <Dialog
                open={!!listToDelete}
                onOpenChange={(open) => !open && setListToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this list?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Movies in the list will be removed. This cannot be
                        undone.
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setListToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteList}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
