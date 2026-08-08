import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import { useSignUp } from "../../services/userService"
import { signUpSchema, SignUpFormData } from "@/lib/validation"
import { useUsernameValidation } from "@/hooks/useUsernameValidation"
import { useEmailAvailability } from "@/hooks/useEmailAvailability"
import UsernameField from "@/components/auth/UsernameField"
import EmailAvailabilityField from "@/components/auth/EmailAvailabilityField"
import FullPageLoader from "@/components/ui/FullPageLoader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SignUp: React.FC = () => {
    const [hidden, setHidden] = useState(true)
    const [confirmHidden, setConfirmHidden] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
        trigger,
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    })
    
    const createUser = useSignUp()
    const username = watch("username")
    const email = watch("email")
    
    const usernameValidation = useUsernameValidation(username, trigger, errors)
    const emailAvailability = useEmailAvailability(email)

    const onSubmit = async (values: SignUpFormData) => {
        if (!usernameValidation.isUsernameAvailable) {
            setError("username", {
                type: "manual",
                message: "Username is not available",
            })
            return
        }

        if (!emailAvailability.isEmailAvailable) {
            setError("email", {
                type: "manual",
                message: "Email is already in use",
            })
            return
        }

        try {
            setIsLoading(true)
            await createUser.mutate(values)
        } catch (error) {
            setIsLoading(false)
            // Handle error
        }
    }

    const preventPaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
    }

    if (isLoading) {
        return <FullPageLoader message="Creating your account..." />
    }

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-5 font-heading">
            <div className="lg:col-span-2 h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold">
                            Sign Up
                        </h2>
                    </div>
                    <form
                        className="mt-8 space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4 text-white">
                            <UsernameField
                                register={register}
                                errors={errors}
                                username={username}
                                usernameValidation={usernameValidation}
                                variant="shadcn"
                            />
                            
                            <EmailAvailabilityField
                                register={register}
                                errors={errors}
                                email={email}
                                emailAvailability={emailAvailability}
                                variant="shadcn"
                            />

                            <div>
                                <Label htmlFor="password" className="sr-only">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={hidden ? "password" : "text"}
                                        placeholder="Password"
                                        className="bg-gray-800 text-white"
                                        {...register("password")}
                                    />
                                    <div
                                        className="absolute top-0 p-2 right-2 h-full aspect-square flex justify-center items-center z-20 hover:cursor-pointer"
                                        onClick={() => setHidden(!hidden)}
                                    >
                                        {hidden ? <EyeOff /> : <Eye />}
                                    </div>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="sr-only">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={confirmHidden ? "password" : "text"}
                                        placeholder="Confirm Password"
                                        className="bg-gray-800 text-white"
                                        onPaste={preventPaste}
                                        {...register("confirmPassword")}
                                    />
                                    <div
                                        className="absolute top-0 p-2 right-2 h-full aspect-square flex justify-center items-center z-20 hover:cursor-pointer"
                                        onClick={() => setConfirmHidden(!confirmHidden)}
                                    >
                                        {confirmHidden ? <EyeOff /> : <Eye />}
                                    </div>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600"
                                disabled={createUser.isPending}
                            >
                                {createUser.isPending
                                    ? "Creating Account..."
                                    : "Sign Up"}
                            </Button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-black text-gray-400">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* TODO: authClient.signIn.social({ provider: "google" }) */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full opacity-60"
                        disabled
                        title="Coming soon"
                    >
                        Continue with Google
                    </Button>

                    <p className="mt-2 text-center text-sm text-gray-300">
                        Already have an account?{" "}
                        <Link
                            to="/signin"
                            className="font-medium text-blue-400 hover:text-blue-300"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex lg:col-span-3 bg-[#FF204E] items-center justify-center">
                <img
                    src="/movie_signup.svg"
                    alt="Sign Up Illustration"
                    className="w-[400px] h-auto"
                />
            </div>
        </div>
    )
}

export default SignUp
