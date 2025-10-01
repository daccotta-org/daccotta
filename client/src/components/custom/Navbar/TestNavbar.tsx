import { FC, useState, type MouseEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Search, Users, NotebookPen, List, LogOutIcon } from "lucide-react"
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

    // Journal item
    const journalItem = { path: "/journal", icon: NotebookPen, tip: "Journal" };
    const logOutItem = { path: "/", icon: LogOutIcon, tip: "Sign Out" };

    const isActive = (path: string) => location.pathname === path;
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
        <nav className="flex flex-col h-screen w-16 bg-black text-white">
            <div className="p-4">
                <Link to="/" className="block">
                    <img src={logo} className="rounded-md" alt="Logo" />
                </Link>
            </div>
            <ul className="flex-1 px-2">
                {navItems.map((item) => (
                    <li key={item.path} className="mb-4">
                        <Link
                            to={item.path}
                            className={`block p-2 rounded-md tooltip tooltip-right ${
                                isActive(item.path)
                                    ? "text-white"
                                    : "text-gray-400"
                            }`}
                            data-tip={item.tip}
                        >
                            <item.icon className="w-6 h-6" />
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Journal link aligned at the bottom */}
            <div className="p-4 mt-auto">
                <Link
                    to={journalItem.path}
                    className={`block p-2 rounded-md tooltip tooltip-right ${
                        isActive(journalItem.path)
                            ? "text-white"
                            : "text-gray-400"
                    }`}
                    data-tip={journalItem.tip}
                >
                    <journalItem.icon color="#c16cf9" className="w-6 h-6" />
                </Link>
            </div>

            {/* Log Out at the bottom */}
            <div className="p-4 mt-auto">
                <Link
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault()
                        setConfirmOpen(true)
                    }}
                    to={logOutItem.path}
                    className={`block p-2 rounded-md tooltip tooltip-right ${
                        isActive(logOutItem.path) ? "text-white" : "text-gray-400"
                    }`}
                    data-tip={logOutItem.tip}
                >
                    <logOutItem.icon color="#c16cf9" className="w-6 h-6" />
                </Link>
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
                            <Button variant="destructive" onClick={handleSignOut}>
                                Remove
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </nav>
    )
}

export default Navbar
