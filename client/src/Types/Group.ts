import { LucideIcon } from "lucide-react"
import { IUser } from "./User"

export type IGroup = {
    id: string
    description?: string
    icon: LucideIcon
    name?: string
    members?: IUser[]
}
