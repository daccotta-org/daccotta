import * as React from "react"
import Avatar from "@mui/material/Avatar"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Popover from "@mui/material/Popover"
import PersonIcon from "@mui/icons-material/Person"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import UsersIcon from "@mui/icons-material/Group"
import BadgeIcon from "@mui/icons-material/EmojiEvents"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { getUserData } from "@/services/userService"
import { useState, useEffect } from "react"

const options = [
    { label: "Profile", icon: <AccountCircleIcon /> },
    { label: "Settings", icon: <SettingsIcon /> },
    { label: "Sign Out", icon: <LogoutIcon /> },
]

export interface SimpleDialogProps {
    open: boolean
    selectedValue: string
    onClose: (value: string) => void
    avatar: string
    userName: string
    friendsCount: number
    badgesCount: number
}

function SimplePopover(props: SimpleDialogProps) {
    const navigate = useNavigate()
    const { signOut } = useAuth()

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error("Error signing out: ", error)
        }
    }

    const { onClose, avatar, userName, friendsCount, badgesCount } = props

    const handleListItemClick = (value: string) => {
        if (value === "Profile") {
            navigate("/profile")
        } else if (value === "Settings") {
            navigate("/settings")
        } else if (value === "Sign Out") {
            handleSignOut()
        }
        onClose(value)
    }

    return (
        <List
            sx={{ pt: 0 }}
            className="flex flex-col items-start bg-background text-white"
        >
            <ListItem className="flex flex-col items-center pb-2 w-full">
                <span className="text-lg font-semibold">{userName}</span>
                <div className="flex gap-2 mt-1">
                    <div className="flex items-center gap-1">
                        <UsersIcon className="w-4 text-blue-400" />
                        <span>{friendsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BadgeIcon className="w-4 text-yellow-400" />
                        <span>{badgesCount}</span>
                    </div>
                </div>
            </ListItem>
            {options.map((option) => (
                <ListItem
                    disableGutters
                    key={option.label}
                    className="hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white transition duration-300 w-full"
                >
                    <ListItemButton
                        onClick={() => handleListItemClick(option.label)}
                        className="flex items-center"
                    >
                        {option.icon}
                        <ListItemText
                            primary={option.label}
                            className="font-heading ml-3"
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default function SimplePopoverDemo() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedValue, setSelectedValue] = useState(options[1].label)
    const [avatar, setAvatar] = useState("")
    const [userName, setUserName] = useState("")
    const [friendsCount, setFriendsCount] = useState(0)
    const [badgesCount, setBadgesCount] = useState(0)
    const { user } = useAuth()

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.uid) {
                try {
                    const userData = await getUserData(user.uid)
                    setAvatar(userData.profile_image)
                    setUserName(userData.userName)
                    setFriendsCount(userData.friends.length)
                    setBadgesCount(userData.badges.length)
                } catch (error) {
                    console.error("Error fetching user data:", error)
                }
            }
        }

        fetchUserData()
    }, [user])

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (value: string) => {
        setAnchorEl(null)
        setSelectedValue(value)
    }

    return (
        <div className="flex justify-end items-start p-4">
            {/* Avatar Icon */}
            <Avatar
                src={avatar}
                alt="User Avatar"
                onClick={handleClick}
                sx={{
                    width: 42,
                    height: 42,
                    cursor: "pointer",
                    bgcolor: avatar ? "transparent" : "red", // Fallback to red background if no avatar
                }}
                className="hover:shadow-2xl hover:scale-110 transition duration-500"
            >
                {!avatar && <PersonIcon />}
            </Avatar>

            {/* Popover Box */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => handleClose(selectedValue)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                PaperProps={{
                    className: "w-[200px] rounded-md bg-background shadow-lg",
                }}
            >
                <SimplePopover
                    selectedValue={selectedValue}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    avatar={avatar}
                    userName={userName}
                    friendsCount={friendsCount}
                    badgesCount={badgesCount}
                />
            </Popover>
        </div>
    )
}
