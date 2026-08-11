import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Users } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { useGroups } from "@/services/groupsService"
import type { GroupSummary } from "@/Types/Group"

const createGroupSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(80),
    description: z.string().trim().max(500).optional(),
})

type CreateGroupForm = z.infer<typeof createGroupSchema>

function GroupCard({ group }: { group: GroupSummary }) {
    const navigate = useNavigate()
    return (
        <button
            type="button"
            onClick={() => navigate(`/groups/${group.id}`)}
            className="w-full text-left rounded-lg border border-border bg-secondary/40 p-4 hover:border-electric/50 transition-colors"
        >
            <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-electric/15 text-electric">
                    <Users className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold text-foreground">
                        {group.name}
                    </h3>
                    {group.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {group.description}
                        </p>
                    ) : null}
                    <p className="mt-2 text-xs text-muted-foreground">
                        {group.member_count} member
                        {group.member_count === 1 ? "" : "s"} ·{" "}
                        {group.list_count} list
                        {group.list_count === 1 ? "" : "s"}
                    </p>
                </div>
            </div>
        </button>
    )
}

export default function GroupsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const { useGetMyGroups, useCreateGroup, getErrorMessage } = useGroups()
    const { data: groups, isLoading, error } = useGetMyGroups()
    const createGroup = useCreateGroup()

    const form = useForm<CreateGroupForm>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: { name: "", description: "" },
    })

    const onSubmit = form.handleSubmit(async (values) => {
        try {
            const group = await createGroup.mutateAsync({
                name: values.name,
                description: values.description || undefined,
            })
            toast.success("Group created")
            setIsCreateOpen(false)
            form.reset()
            window.location.assign(`/groups/${group.id}`)
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to create group"))
        }
    })

    if (isLoading) {
        return <FullPageLoader message="Loading groups..." />
    }

    if (error) {
        return (
            <div className="p-8 text-white">
                Failed to load groups. Please try again.
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full overflow-auto p-6 text-white scrollbar-hide md:p-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Groups</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Watch together with friends — shared lists, stats,
                            and picks.
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create
                    </Button>
                </div>

                {!groups?.length ? (
                    <div className="rounded-lg border border-dashed border-border p-10 text-center">
                        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            No groups yet. Create one and add friends.
                        </p>
                        <Button
                            className="mt-4"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            Create group
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {groups.map((group) => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                    </div>
                )}
            </div>

            <Drawer open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DrawerContent>
                    <form
                        onSubmit={onSubmit}
                        className="mx-auto w-full max-w-sm"
                    >
                        <DrawerHeader>
                            <DrawerTitle>Create group</DrawerTitle>
                            <DrawerDescription>
                                You&apos;ll be the admin. Add friends after
                                creating.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="space-y-4 p-4 pb-0">
                            <div className="space-y-2">
                                <Label htmlFor="group-name">Name</Label>
                                <Input
                                    id="group-name"
                                    placeholder="Weekend Watch Club"
                                    {...form.register("name")}
                                />
                                {form.formState.errors.name ? (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.name.message}
                                    </p>
                                ) : null}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="group-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="group-description"
                                    placeholder="What is this group for?"
                                    {...form.register("description")}
                                />
                            </div>
                        </div>
                        <DrawerFooter>
                            <Button
                                type="submit"
                                disabled={createGroup.isPending}
                            >
                                {createGroup.isPending
                                    ? "Creating..."
                                    : "Create group"}
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
        </div>
    )
}
