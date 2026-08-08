import React from "react"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { CheckCircle, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseEmailValidationReturn } from "@/hooks/useEmailValidation"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface EmailFieldProps {
    register: UseFormRegister<any>
    errors: FieldErrors
    email: string
    emailValidation: UseEmailValidationReturn
    className?: string
}

const EmailField: React.FC<EmailFieldProps> = ({
    register,
    errors,
    email,
    emailValidation,
    className = "",
}) => {
    const { isEmailExists, isCheckingEmail } = emailValidation

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
                    className={`pr-10 ${errors.email ? "border-destructive" : ""}`}
                    {...register("email")}
                />
                {email && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {isCheckingEmail ? (
                            <LoadingSpinner size="sm" />
                        ) : isEmailExists === true ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : isEmailExists === false ? (
                            <XCircle className="h-4 w-4 text-destructive" />
                        ) : null}
                    </span>
                )}
            </div>
            {errors.email && (
                <p className="mt-2 text-sm text-destructive">
                    {errors.email?.message?.toString()}
                </p>
            )}
        </div>
    )
}

export default EmailField
