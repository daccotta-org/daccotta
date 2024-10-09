import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { avatars } from "../../../assets/avatars"

interface UsernameAndAvatarProps {
    onNext: () => void
}

const UsernameAndAvatar: React.FC<UsernameAndAvatarProps> = ({ onNext }) => {
    const { setValue, watch } = useFormContext()
    const profileUrl = watch("profile_image")
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null)

    const handleAvatarSelect = (index: number) => {
        setSelectedAvatarIndex(index)
        setValue("profile_image", avatars[index].profile)
    }

    const handleNext = () => {
        if (profileUrl !== "") {
            onNext()
        }
    }

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-5">
            <div className="lg:col-span-2 h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
                <div className="max-w-md w-full space-y-8">
                    <h2 className="mt-6 text-center text-3xl font-extrabold">Choose an Avatar</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {avatars.map((avatar, index) => (
                            <img
                                key={avatar.id}
                                src={avatar.profile}
                                alt={`Avatar ${index + 1}`}
                                className={`w-full h-auto cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg ${
                                    selectedAvatarIndex === index ? "ring-2 ring-offset-2 ring-white" : ""
                                }`}
                                onClick={() => handleAvatarSelect(index)}
                            />
                        ))}
                    </div>
                    <div>
                        <button
                            type="button" // Change to button type
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            disabled={!profileUrl}
                            onClick={handleNext} // Use the new handler
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex lg:col-span-3 bg-[#FF204E] items-center justify-center">
                <img
                    src="/profile_page.svg"
                    alt="Sign Up Illustration"
                    className="w-[400px] h-auto"
                />
            </div>
        </div>
    )
}

export default UsernameAndAvatar
