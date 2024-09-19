// import React from "react"
// import { FC } from "react"
// import { Link } from "react-router-dom"
// import { Home, Search, Users, Settings } from "lucide-react"
// import logo from "../../../assets/logo_light.svg"

// const Navbar: FC = () => {
//     return (
//         <nav className="flex flex-col h-screen w-16 bg-black text-white">
//             <div className="p-4">
//                 <Link to="/" className="block">
//                     <img src={logo} className="" alt="" />
//                 </Link>
//             </div>
//             <ul className="flex-1 px-2">
//                 <li className="mb-4">
//                     <Link
//                         to="/"
//                         className="block p-2 rounded-md hover:bg-gray-700  tooltip tooltip-right"
//                         data-tip="Home"
//                     >
//                         <Home className="w-6 h-6" />
//                     </Link>
//                 </li>
//                 <li className="mb-4">
//                     <Link
//                         to="/search-movie"
//                         className="block p-2 rounded-md hover:bg-gray-800  hover:text-white tooltip tooltip-right"
//                         data-tip="Search"
//                     >
//                         <Search className="w-6 h-6" />
//                     </Link>
//                 </li>
//                 <li className="mb-4">
//                     <Link
//                         to="/friends"
//                         className="block p-2 rounded-md hover:bg-gray-800  hover:text-white tooltip tooltip-right"
//                         data-tip="Friends"
//                     >
//                         <Users className="w-6 h-6" />
//                     </Link>
//                 </li>
//             </ul>
//             <div className="p-4">
//                 <Link
//                     to="/settings"
//                     className="block p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white"
//                 >
//                     <Settings className="w-6 h-6" />
//                 </Link>
//             </div>
//         </nav>
//     )
// }

// export default Navbar

import React from "react"
import { FC } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Search, Users, Settings, NotebookPen } from "lucide-react"
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
                    <img src={logo} className="" alt="" />
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
                    className={`block p-2 rounded-md  ${
                        isActive("/journal") ? "text-white" : "text-gray-400"
                    }`}
                >
                    {/* <Settings className="w-6 h-6" /> */}
                    <NotebookPen
                        color="#c16cf9"
                        data-tip="Log"
                        className="tooltip tooltip-right"
                    />
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
