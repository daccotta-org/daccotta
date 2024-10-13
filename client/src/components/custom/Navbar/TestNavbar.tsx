import { FC } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Search, Users, NotebookPen } from "lucide-react"
import logo from "../../../assets/logo_light.svg"

const Navbar: FC = () => {
    const location = useLocation()

    const navItems = [
        { path: "/", icon: Home, tip: "Home" },
        { path: "/search-movie", icon: Search, tip: "Search" },
        { path: "/friends", icon: Users, tip: "Friends" },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <nav className="flex flex-col h-screen w-16 bg-black text-white">
            <div className="p-4">
                <Link to="/" className="block">
                    <img src={logo} className="rounded-md" alt="" />
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
            <div className="p-4">
                <Link
                    to="/journal"
                    className={`block p-2 rounded-md tooltip tooltip-right  ${
                        isActive("/journal") ? "text-white" : "text-gray-400"
                    }`}
                    data-tip="Journal"
                >
                    {/* <Settings className="w-6 h-6" /> */}
                    <NotebookPen
                        color="#c16cf9"
                        
                    />
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
