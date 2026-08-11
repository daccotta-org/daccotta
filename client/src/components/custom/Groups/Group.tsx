import React from "react"
import { IGroup } from "../../../Types/Group"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const Group: React.FC<IGroup> = ({ id, icon: Icon, name }) => {
    if (!Icon) return null
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div className="text-foreground">
                        <Link to={`/groups/${id}`} aria-label={name}>
                            <Icon className="h-8 w-8" />
                        </Link>
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right">{name}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default Group
