import { FC, useState, type MouseEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Search, Users, NotebookPen, List, LogOut } from "lucide-react"
import logo from "../../../assets/logo_light.svg"
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

const Navbar: FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [confirmOpen, setConfirmOpen] = useState(false)

    const navItems = [
        { path: "/", icon: Home, tip: "Home" },
        { path: "/search-movie", icon: Search, tip: "Search" },
        { path: "/friends", icon: Users, tip: "Friends" },
        { path: "/lists", icon: List, tip: "Lists" },
    ]

    const journalItem = { path: "/journal", icon: NotebookPen, tip: "Journal" }
    const logOutItem = { path: "/", icon: LogOut, tip: "Sign Out" }

    const isActive = (path: string) => location.pathname === path
    const { signOut } = useAuth()

    const handleSignOut = async () => {
        try {
            await signOut()
            setConfirmOpen(false)
            navigate("/", { replace: true })
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }

    return (
        <TooltipProvider delayDuration={200}>
            <nav className="flex h-screen w-16 flex-col bg-black text-white">
                <div className="p-4">
                    <Link to="/" className="block">
                        <img src={logo} className="rounded-md" alt="Logo" />
                    </Link>
                </div>
                <ul className="flex-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.path} className="mb-4">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        to={item.path}
                                        className={`block rounded-md p-2 ${
                                            isActive(item.path)
                                                ? "text-white"
                                                : "text-gray-400"
                                        }`}
                                        aria-label={item.tip}
                                    >
                                        <item.icon className="h-6 w-6" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    {item.tip}
                                </TooltipContent>
                            </Tooltip>
                        </li>
                    ))}
                </ul>

                <div className="mt-auto p-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to={journalItem.path}
                                className={`block rounded-md p-2 ${
                                    isActive(journalItem.path)
                                        ? "text-white"
                                        : "text-gray-400"
                                }`}
                                aria-label={journalItem.tip}
                            >
                                <journalItem.icon className="h-6 w-6 text-primary" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            {journalItem.tip}
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="mt-auto p-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                                    e.preventDefault()
                                    setConfirmOpen(true)
                                }}
                                to={logOutItem.path}
                                className="block rounded-md p-2 text-gray-400"
                                aria-label={logOutItem.tip}
                            >
                                <logOutItem.icon className="h-6 w-6 text-primary" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            {logOutItem.tip}
                        </TooltipContent>
                    </Tooltip>
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
                                    onClick={handleSignOut}
                                >
                                    Sign Out
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </nav>
        </TooltipProvider>
    )
}

export default Navbar
