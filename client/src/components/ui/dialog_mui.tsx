import * as React from "react"
import Avatar from "@mui/material/Avatar"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Popover from "@mui/material/Popover"
import PersonIcon from "@mui/icons-material/Person"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { getUserData } from "@/services/userService"
import { useState, useEffect } from "react"

const options = ["Profile", "Settings", "Sign Out"]

export interface SimpleDialogProps {
    open: boolean
    selectedValue: string
    onClose: (value: string) => void
    avatar: string
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

    const { onClose, selectedValue, open, avatar } = props

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
            className="flex flex-col items-center bg-background text-white"
        >
            {options.map((option) => (
                <ListItem
                    disableGutters
                    key={option}
                    className="hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white transition duration-300 w-full"
                >
                    <ListItemButton onClick={() => handleListItemClick(option)}>
                        <ListItemText
                            primary={option}
                            className="text-center font-heading"
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default function SimplePopoverDemo() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedValue, setSelectedValue] = useState(options[1])
    const [avatar, setAvatar] = useState("")
    const { user } = useAuth()

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.uid) {
                try {
                    const userData = await getUserData(user.uid)
                    setAvatar(userData.profile_image)
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
                />
            </Popover>
        </div>
    )
}
