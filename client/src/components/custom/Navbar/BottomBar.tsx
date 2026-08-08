import { FC, useState } from "react"
import { IoLogInOutline } from "react-icons/io5"
import { FaUser } from "react-icons/fa"
import { FiLogOut } from "react-icons/fi"
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

const Bottom: FC = () => {
    const { isSignedIn, signOut } = useAuth()
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleSignOut = async () => {
        try {
            await signOut()
            // You can add post-logout actions here, like redirecting to home page
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }

    return (
        <div className="p-2 h-100 w-full flex flex-col items-center justify-between  gap-1">
            {isSignedIn ? (
                <div className="flex flex-col items-center gap-2">
                    <Link to="/profile">
                        <button
                            className="tooltip tooltip-right"
                            data-tip="profile"
                        >
                            <FaUser
                                size="1rem"
                                className="text-white cursor-pointer"
                            />
                        </button>
                    </Link>
                    <button
                        className="tooltip tooltip-right"
                        data-tip="logout"
                        onClick={() => setConfirmOpen(true)}
                    >
                        <FiLogOut size="1rem" className="text-white cursor-pointer" />
                    </button>
                </div>
            ) : (
                <Link to="/signin">
                    <IoLogInOutline
                        size="1rem"
                        className="text-white cursor-pointer"
                    />
                </Link>
            )}
            <ThemeController />
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                            are you sure you want to logout?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                await handleSignOut()
                                setConfirmOpen(false)
                            }}
                        >
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Bottom
