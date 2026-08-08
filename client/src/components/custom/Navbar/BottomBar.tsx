import { FC, useState } from "react"
import { LogIn, LogOut, User } from "lucide-react"
import ThemeController from "./ThemeController"
import { Link } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../ui/tooltip"

const Bottom: FC = () => {
    const { isSignedIn, signOut } = useAuth()
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex h-full w-full flex-col items-center justify-between gap-1 p-2">
                {isSignedIn ? (
                    <div className="flex flex-col items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link to="/profile" aria-label="Profile">
                                        <User className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Profile</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Logout"
                                    onClick={() => setConfirmOpen(true)}
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Logout</TooltipContent>
                        </Tooltip>
                    </div>
                ) : (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild>
                                <Link to="/signin" aria-label="Sign in">
                                    <LogIn className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Sign in</TooltipContent>
                    </Tooltip>
                )}
                <ThemeController />
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
        </TooltipProvider>
    )
}

export default Bottom
