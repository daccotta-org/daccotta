import React from "react"
import { Home, NotebookPen, Search, User, Users } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

import { Dock, DockIcon } from "@/components/magicui/dock"
import { toast } from "react-toastify"

export type IconProps = React.HTMLAttributes<SVGElement>

export function DockDemo() {
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

    return (
        <div className="relative top-[-30px] w-[335px]">
            <Dock magnification={60} distance={60} className="gap-8">
                <DockIcon
                    className={`bg-black/10 p-3 dark:bg-white/10 ${isActive("/") ? "bg-electric/20 text-electric" : ""}`}
                    onClick={() => navigate("/")}
                >
                    <Home className="h-4 w-4 text-foreground" />
                </DockIcon>
                <DockIcon
                    className={`bg-black/10 p-3 dark:bg-white/10 ${isActive("/search") ? "bg-electric/20 text-electric" : ""}`}
                    onClick={() => navigate("/search")}
                >
                    <Search className="h-4 w-4 text-foreground" />
                </DockIcon>
                <DockIcon
                    className={`bg-black/10 p-3 dark:bg-white/10 ${isActive("/journal") ? "bg-electric/20 text-electric" : ""}`}
                    onClick={() => navigate("/journal")}
                >
                    <NotebookPen className="h-4 w-4" />
                </DockIcon>
                <DockIcon
                    className={`bg-black/10 p-3 dark:bg-white/10 ${isActive("/groups") ? "bg-electric/20 text-electric" : ""}`}
                    onClick={() => {
                        navigate("/")
                        toast.warning("Coming Soon!")
                    }}
                >
                    <Users className="h-4 w-4 text-foreground" />
                </DockIcon>
                <DockIcon
                    className={`bg-black/10 p-3 dark:bg-white/10 ${isActive("/friends") ? "bg-electric/20 text-electric" : ""}`}
                    onClick={() => navigate("/friends")}
                >
                    <User className="h-4 w-4 text-foreground" />
                </DockIcon>
            </Dock>
        </div>
    )
}
