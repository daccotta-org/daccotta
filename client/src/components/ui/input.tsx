import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-2xl border border-gray-700 bg-background px-3 py-2 text-sm ring-gray-700 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-600   focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
