import React from "react"

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg"
    className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = "md",
    className = "",
}) => {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-4",
        lg: "w-12 h-12 border-4",
    }

    return (
        <div
            className={`border-white border-t-transparent rounded-full animate-spin ${sizeClasses[size]} ${className}`}
        />
    )
}

export default LoadingSpinner
