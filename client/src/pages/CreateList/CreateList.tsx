import React, { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { createList } from "@/services/userService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"

interface CreateListProps {
    onClose: () => void
}

const CreateList: React.FC<CreateListProps> = ({ onClose }) => {
    const [listName, setListName] = useState("")
    const [description, setDescription] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [loading, setLoading] = useState(false) 
    const { user } = useAuth()

    const handleSubmit = async () => {
        if (!user) return
        setLoading(true) // Start loading
        console.log("Creating list...", listName, description, isPublic)

        try {
            await createList(user.uid, {
                name: listName,
                description,
                isPublic,
                list_type: "user",
            })
            onClose() // Close the drawer after successful creation
        } catch (error) {
            console.error("Error creating list:", error)
            // Handle error (e.g., show error message to user)
        }finally {
            setLoading(false) // Stop loading
        }
        window.location.reload()
    }

    return (
        <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
                <DrawerHeader className="white-font">
                    <DrawerTitle>Create New List</DrawerTitle>
                    <DrawerDescription>
                        Create a new movie list to share with friends.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0 white-font">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="list-name" className="white-font">List Name</Label>
                            <Input
                                id="list-name"
                                placeholder="Enter list name"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                className="white-font"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="white-font">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter list description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="white-font"
                            />
                        </div>
                        <div className="flex items-center space-x-2 white-font">
                            <Switch
                                id="public"
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                            <Label htmlFor="public">Make list public</Label>
                        </div>
                    </div>
                </div>
                <DrawerFooter>
                    <Button onClick={handleSubmit} disabled={loading} className="white-font">
                        {loading ? "Creating..." : "Create List"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </div>
        </DrawerContent>
    )
}

export default CreateList
