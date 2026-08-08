import { FC, useState, type MouseEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Search, Users, NotebookPen, List, LogOut } from "lucide-react"
import logo from "../../../assets/logo_light.svg"
import { useAuth } from "../../../hooks/useAuth"
import { useGlobalSearch } from "@/context/GlobalSearchContext"
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
    const { openSearch, isOpen: searchOpen } = useGlobalSearch()

    const navItems = [
        { path: "/friends", icon: Users, tip: "Friends" },
        { path: "/lists", icon: List, tip: "Lists" },
    ]

    const journalItem = { path: "/journal", icon: NotebookPen, tip: "Journal" }
    const logOutItem = { path: "/", icon: LogOut, tip: "Sign Out" }

    const isActive = (path: string) => location.pathname === path
    const searchActive = searchOpen || location.pathname === "/search"
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

    const navLinkClass = (active: boolean) =>
        `relative block rounded-[4px] p-2 transition-colors ${
            active
                ? "text-electric"
                : "text-muted-foreground hover:text-foreground"
        }`

    return (
        <TooltipProvider delayDuration={200}>
            <nav className="flex h-screen w-16 flex-col bg-[#0A0A0B] text-foreground">
                <div className="p-4">
                    <Link to="/" className="block">
                        <img src={logo} className="rounded-[4px]" alt="Logo" />
                    </Link>
                </div>
                <ul className="flex-1 px-2">
                    <li className="mb-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to="/"
                                    className={navLinkClass(isActive("/"))}
                                    aria-label="Home"
                                    aria-current={
                                        isActive("/") ? "page" : undefined
                                    }
                                >
                                    {isActive("/") && (
                                        <span
                                            aria-hidden
                                            className="absolute -left-2 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-electric"
                                        />
                                    )}
                                    <Home className="h-6 w-6" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Home</TooltipContent>
                        </Tooltip>
                    </li>
                    <li className="mb-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => openSearch()}
                                    className={navLinkClass(searchActive)}
                                    aria-label="Search"
                                    aria-expanded={searchOpen}
                                >
                                    {searchActive && (
                                        <span
                                            aria-hidden
                                            className="absolute -left-2 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-electric"
                                        />
                                    )}
                                    <Search className="h-6 w-6" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Search (⌘K)
                            </TooltipContent>
                        </Tooltip>
                    </li>
                    {navItems.map((item) => (
                            <li key={item.path} className="mb-4">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            to={item.path}
                                            className={navLinkClass(
                                                isActive(item.path)
                                            )}
                                            aria-label={item.tip}
                                            aria-current={
                                                isActive(item.path)
                                                    ? "page"
                                                    : undefined
                                            }
                                        >
                                            {isActive(item.path) && (
                                                <span
                                                    aria-hidden
                                                    className="absolute -left-2 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-electric"
                                                />
                                            )}
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
                                className={navLinkClass(
                                    isActive(journalItem.path)
                                )}
                                aria-label={journalItem.tip}
                                aria-current={
                                    isActive(journalItem.path)
                                        ? "page"
                                        : undefined
                                }
                            >
                                {isActive(journalItem.path) && (
                                    <span
                                        aria-hidden
                                        className="absolute -left-2 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-electric"
                                    />
                                )}
                                <journalItem.icon className="h-6 w-6" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            {journalItem.tip}
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="p-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                                    e.preventDefault()
                                    setConfirmOpen(true)
                                }}
                                to={logOutItem.path}
                                className="block rounded-[4px] p-2 text-muted-foreground transition-colors hover:text-primary"
                                aria-label={logOutItem.tip}
                            >
                                <logOutItem.icon className="h-6 w-6" />
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
