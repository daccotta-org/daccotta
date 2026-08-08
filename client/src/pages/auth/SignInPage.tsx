import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { auth } from "../../lib/firebase"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendPasswordResetEmail } from "firebase/auth"

import { signInSchema, SignInFormData } from "@/lib/validation"
import { useEmailValidation } from "@/hooks/useEmailValidation"
import { useSignIn } from "@/hooks/useSignIn"
import EmailField from "@/components/auth/EmailField"

const SignInPage2: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    })

    const [hidden, setHidden] = useState(true)

    const email = watch("email")
    const emailValidation = useEmailValidation(email)
    const signInMutation = useSignIn(reset)

    const onSubmit = (data: SignInFormData) => {
        signInMutation.mutate(data)
    }

    const resetPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address.")
            return
        }
        try {
            await sendPasswordResetEmail(auth, email)
            toast.success("Password reset email sent! Check your inbox.")
        } catch (error) {
            console.error("Failed to send password reset email:", error)
            toast.error(
                "Failed to send password reset email. Please try again."
            )
        }
    }

    return (
        <>
            <div className="w-full min-h-screen lg:grid lg:grid-cols-5 font-heading">
                <div className="lg:col-span-2 h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
                    <div className="max-w-md w-full space-y-8">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold">
                                Sign In
                            </h2>
                        </div>
                        <form
                            className="mt-8 space-y-6"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="space-y-4 text-white">
                                <EmailField
                                    register={register}
                                    errors={errors}
                                    email={email}
                                    emailValidation={emailValidation}
                                    variant="shadcn"
                                />

                                <div>
                                    <Label
                                        htmlFor="password"
                                        className="sr-only"
                                    >
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
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600"
                                    disabled={
                                        signInMutation.isPending ||
                                        !emailValidation.isEmailExists
                                    }
                                >
                                    {signInMutation.isPending
                                        ? "Signing In..."
                                        : "Sign In"}
                                </Button>
                            </div>
                        </form>
                        {/* Reset Password Button */}
                        <div className="mt-4">
                            <Button
                                onClick={resetPassword}
                                className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600"
                                disabled={!emailValidation.isEmailExists}
                            >
                                Forgot Password?
                            </Button>
                        </div>
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

                        <p className="mt-2 text-center text-sm text-gray-300">
                            New User?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-blue-400 hover:text-blue-300"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="hidden lg:flex lg:col-span-3 bg-[#FF204E] items-center justify-center">
                    <img
                        src="/movie_signup.svg"
                        alt="Sign In Illustration"
                        className="w-[400px] h-auto"
                    />
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default SignInPage2
