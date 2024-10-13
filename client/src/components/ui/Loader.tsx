import React from "react"

const Loader: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <div
        className="animate-spin rounded-full border-4 border-t-transparent border-black"
        style={{ width: size, height: size }}
    />
)

export default Loader
