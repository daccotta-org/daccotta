import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Award,
    LogOut,
    Settings,
    User,
    Users,
} from "lucide-react"
import { toast } from "react-toastify"
import { useAuth } from "../../hooks/useAuth"
import { getUserData } from "@/services/userService"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu"

export default function ProfileMenu() {
    const navigate = useNavigate()
    const { user, signOut } = useAuth()
    const [avatar, setAvatar] = useState("")
    const [userName, setUserName] = useState("")
    const [friendsCount, setFriendsCount] = useState(0)
    const [badgesCount, setBadgesCount] = useState(0)
    const [confirmOpen, setConfirmOpen] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.uid) return
            try {
                const userData = await getUserData(user.uid)
                setAvatar(userData.profile_image)
                setUserName(userData.userName)
                setFriendsCount(userData.friends.length)
                setBadgesCount(userData.badges.length)
            } catch (error) {
                console.error("Error fetching user data:", error)
            }
        }

        fetchUserData()
    }, [user])

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }

    return (
        <div className="flex justify-end items-start p-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="rounded-full outline-none ring-offset-background transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="Open profile menu"
                    >
                        <Avatar className="h-[42px] w-[42px]">
                            <AvatarImage src={avatar} alt={userName || "User"} />
                            <AvatarFallback className="bg-destructive text-destructive-foreground">
                                <User className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold">
                                {userName || "User"}
                            </span>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    {friendsCount}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Award className="h-3.5 w-3.5" />
                                    {badgesCount}
                                </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            navigate("/")
                            toast.warning("Coming Soon!")
                        }}
                    >
                        <Settings />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() => setConfirmOpen(true)}
                    >
                        <LogOut />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to logout?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                await handleSignOut()
                                setConfirmOpen(false)
                            }}
                        >
                            Sign Out
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
