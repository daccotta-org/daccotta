import React from "react"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { CheckCircle, XCircle } from "lucide-react"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseEmailAvailabilityReturn } from "@/hooks/useEmailAvailability"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface EmailAvailabilityFieldProps {
    register: UseFormRegister<any>
    errors: FieldErrors
    email: string
    emailAvailability: UseEmailAvailabilityReturn
    variant?: "daisyui" | "shadcn"
    className?: string
}

const EmailAvailabilityField: React.FC<EmailAvailabilityFieldProps> = ({
    register,
    errors,
    email,
    emailAvailability,
    variant = "shadcn",
    className = "",
}) => {
    const { isEmailAvailable, isCheckingEmail } = emailAvailability

    if (variant === "daisyui") {
        return (
            <div className={`form-control relative ${className}`}>
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <div className="relative">
                    <input
                        type="email"
                        placeholder="Email"
                        className={`input input-bordered bg-transparent w-full pr-10 ${
                            errors.email ? "input-error" : ""
                        }`}
                        {...register("email")}
                    />
                    {email && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {isCheckingEmail ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : isEmailAvailable === true ? (
                                <FaCheckCircle className="text-success" />
                            ) : isEmailAvailable === false ? (
                                <FaTimesCircle
                                    className="text-error tooltip tooltip-top"
                                    data-tip="Email already in use"
                                />
                            ) : null}
                        </span>
                    )}
                </div>
                {errors.email && (
                    <label className="label">
                        <span className="label-text-alt text-error">
                            {errors.email?.message?.toString()}
                        </span>
                    </label>
                )}
            </div>
        )
    }

    return (
        <div className={className}>
            <Label htmlFor="email" className="sr-only">
                Email
            </Label>
            <div className="relative">
                <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className={`bg-gray-800 text-white ${errors.email ? "border-red-500" : ""}`}
                    {...register("email")}
                />
                {email && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {isCheckingEmail ? (
                            <LoadingSpinner size="sm" />
                        ) : isEmailAvailable === true ? (
                            <CheckCircle className="text-green-500" size={16} />
                        ) : isEmailAvailable === false ? (
                            <XCircle className="text-red-500" size={16} />
                        ) : null}
                    </span>
                )}
            </div>
            {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                    {errors.email?.message?.toString()}
                </p>
            )}
        </div>
    )
}

export default EmailAvailabilityField
