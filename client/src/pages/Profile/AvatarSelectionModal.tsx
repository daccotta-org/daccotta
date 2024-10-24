import React, { useState } from "react"
import { avatars } from "../../assets/avatars"
import { X } from "lucide-react"

interface AvatarSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectAvatar: (avatar: string) => void
    currentAvatar: string
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
    isOpen,
    onClose,
    onSelectAvatar,
    currentAvatar,
}) => {
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<
        number | null
    >(null)

    // Update the selected avatar index based on currentAvatar
    React.useEffect(() => {
        const currentIndex = avatars.findIndex(
            (avatar) => avatar.profile === currentAvatar
        )
        setSelectedAvatarIndex(currentIndex !== -1 ? currentIndex : null)
    }, [currentAvatar])

    if (!isOpen) return null

    const handleAvatarSelect = (index: number) => {
        setSelectedAvatarIndex(index)
        onSelectAvatar(avatars[index].profile)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 max-w-md w-full relative">
                <button
                    onClick={onClose}
                    aria-label="Close Avatar Selection"
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Choose an Avatar
                </h2>

                <div className="grid grid-cols-3 gap-4 justify-center items-center">
                    {avatars.map((avatar, index) => (
                        <button
                            key={avatar.id}
                            onClick={() => handleAvatarSelect(index)}
                            aria-label={`Select Avatar ${index + 1}`}
                            className={`relative rounded-lg overflow-hidden p-2 transition-transform hover:scale-105 ${
                                selectedAvatarIndex !== null &&
                                selectedAvatarIndex !== index
                                    ? "opacity-50"
                                    : "opacity-100"
                            }`}
                        >
                            <img
                                src={avatar.profile}
                                alt={`Avatar ${index + 1}`}
                                className="w-16 h-16 md:w-20 md:h-20 rounded-md bg-white shadow-md"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AvatarSelectionModal
