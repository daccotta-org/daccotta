import React from "react"
import LoadingSpinner from "./LoadingSpinner"

interface FullPageLoaderProps {
    message?: string
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({
    message = "Loading...",
}) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <LoadingSpinner size="lg" />
            {message && <p className="mt-4 text-white text-lg">{message}</p>}
        </div>
    )
}

export default FullPageLoader
