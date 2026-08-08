import React from "react"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { CheckCircle, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseUsernameValidationReturn } from "@/hooks/useUsernameValidation"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface UsernameFieldProps {
    register: UseFormRegister<any>
    errors: FieldErrors
    username: string
    usernameValidation: UseUsernameValidationReturn
    className?: string
}

const UsernameField: React.FC<UsernameFieldProps> = ({
    register,
    errors,
    username,
    usernameValidation,
    className = "",
}) => {
    const { isUsernameAvailable, isChecking } = usernameValidation

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
                    className={`pr-10 ${errors.username ? "border-destructive" : ""}`}
                    {...register("username")}
                />
                {username && username.length >= 3 && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {isChecking ? (
                            <LoadingSpinner size="sm" />
                        ) : isUsernameAvailable === true ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : isUsernameAvailable === false ? (
                            <XCircle className="h-4 w-4 text-destructive" />
                        ) : null}
                    </span>
                )}
            </div>
            {errors.username && (
                <p className="mt-2 text-sm text-destructive">
                    {errors.username?.message?.toString()}
                </p>
            )}
        </div>
    )
}

export default UsernameField
