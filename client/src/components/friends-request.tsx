import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, UserMinus } from "lucide-react"

type FriendRequest = {
    id: string
    name: string
    avatar: string
}

export function FriendsRequest() {
    const [requests, setRequests] = useState<FriendRequest[]>([
        {
            id: "1",
            name: "Alice Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "2",
            name: "Bob Smith",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "3",
            name: "Charlie Brown",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "4",
            name: "Diana Prince",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "5",
            name: "Ethan Hunt",
            avatar: "/placeholder.svg?height=40&width=40",
        },
    ])

    const handleAccept = (id: string) => {
        setRequests(requests.filter((request) => request.id !== id))
        // In a real app, you would also send an API request to update the server
    }

    const handleDecline = (id: string) => {
        setRequests(requests.filter((request) => request.id !== id))
        // In a real app, you would also send an API request to update the server
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Friend Requests</CardTitle>
                <CardDescription>
                    You have {requests.length} pending friend requests
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="flex items-center justify-between mb-4 last:mb-0"
                        >
                            <div className="flex items-center space-x-4">
                                <Avatar>
                                    <AvatarImage
                                        src={request.avatar}
                                        alt={request.name}
                                    />
                                    <AvatarFallback>
                                        {request.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">
                                        {request.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Wants to be your friend
                                    </p>
                                </div>
                            </div>
                            <div className="space-x-2">
                                <Button
                                    size="sm"
                                    onClick={() => handleAccept(request.id)}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Accept
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDecline(request.id)}
                                    className="text-red-500 border-red-500 hover:bg-red-50"
                                >
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Decline
                                </Button>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
