import { Home, Search, Users, Group } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/search", label: "Search", icon: Search },
    { to: "/friends", label: "Friends", icon: Users },
    { to: "/groups", label: "Groups", icon: Group },
] as const

const TopNavbar = () => {
    return (
        <TooltipProvider delayDuration={200}>
            <nav className="flex h-full w-full flex-col items-center justify-center gap-4 p-2 text-foreground">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <Tooltip key={to}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                asChild
                                className="h-auto flex-col gap-1 px-2 py-2"
                            >
                                <Link to={to}>
                                    <Icon className="h-5 w-5" />
                                    <span className="text-xs">{label}</span>
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{label}</TooltipContent>
                    </Tooltip>
                ))}
            </nav>
        </TooltipProvider>
    )
}

export default TopNavbar
