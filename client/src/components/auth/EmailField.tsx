import React from "react"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { CheckCircle, XCircle } from "lucide-react"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseEmailValidationReturn } from "@/hooks/useEmailValidation"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface EmailFieldProps {
    register: UseFormRegister<any>
    errors: FieldErrors
    email: string
    emailValidation: UseEmailValidationReturn
    variant?: "daisyui" | "shadcn"
    className?: string
}

const EmailField: React.FC<EmailFieldProps> = ({
    register,
    errors,
    email,
    emailValidation,
    variant = "shadcn",
    className = "",
}) => {
    const { isEmailExists, isCheckingEmail } = emailValidation

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
                            ) : isEmailExists === true ? (
                                <FaCheckCircle className="text-success" />
                            ) : isEmailExists === false ? (
                                <FaTimesCircle
                                    className="text-error tooltip tooltip-top"
                                    data-tip="Email not found"
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
                        ) : isEmailExists === true ? (
                            <CheckCircle className="text-green-500" size={16} />
                        ) : isEmailExists === false ? (
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

export default EmailField
