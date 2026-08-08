import React from "react"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { CheckCircle, XCircle } from "lucide-react"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseUsernameValidationReturn } from "@/hooks/useUsernameValidation"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface UsernameFieldProps {
    register: UseFormRegister<any>
    errors: FieldErrors
    username: string
    usernameValidation: UseUsernameValidationReturn
    variant?: "daisyui" | "shadcn"
    className?: string
}

const UsernameField: React.FC<UsernameFieldProps> = ({
    register,
    errors,
    username,
    usernameValidation,
    variant = "shadcn",
    className = "",
}) => {
    const { isUsernameAvailable, isChecking } = usernameValidation

    if (variant === "daisyui") {
        return (
            <div className={`form-control relative ${className}`}>
                <label className="label">
                    <span className="label-text">Username</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Username"
                        className={`input input-bordered bg-transparent w-full pr-10 ${
                            errors.username ? "input-error" : ""
                        }`}
                        {...register("username")}
                    />
                    {username && username.length >= 3 && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {isChecking ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : isUsernameAvailable === true ? (
                                <FaCheckCircle className="text-success" />
                            ) : isUsernameAvailable === false ? (
                                <FaTimesCircle className="text-error" />
                            ) : null}
                        </span>
                    )}
                </div>
                {errors.username && (
                    <label className="label">
                        <span className="label-text-alt text-error">
                            {errors.username?.message?.toString()}
                        </span>
                    </label>
                )}
            </div>
        )
    }

    return (
        <div className={className}>
            <Label htmlFor="username" className="sr-only">
                Username
            </Label>
            <div className="relative">
                <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    className={`bg-gray-800 text-white ${errors.username ? "border-red-500" : ""}`}
                    {...register("username")}
                />
                {username && username.length >= 3 && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {isChecking ? (
                            <LoadingSpinner size="sm" />
                        ) : isUsernameAvailable === true ? (
                            <CheckCircle className="text-green-500" size={16} />
                        ) : isUsernameAvailable === false ? (
                            <XCircle className="text-red-500" size={16} />
                        ) : null}
                    </span>
                )}
            </div>
            {errors.username && (
                <p className="mt-2 text-sm text-red-500">
                    {errors.username?.message?.toString()}
                </p>
            )}
        </div>
    )
}

export default UsernameField
