import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

    // TODO: wire better-auth forgetPassword + email provider (Resend/SendGrid/SMTP)
    const resetPassword = async () => {
        toast.info("Password reset is not available yet. Check back soon.")
        // await authClient.forgetPassword({ email, redirectTo: "/reset-password" })
    }

    // TODO: authClient.signIn.social({ provider: "google" })
    const signInWithGoogle = () => {
        toast.info("Google sign-in is coming soon.")
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
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
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
                        <div className="mt-4">
                            <Button
                                type="button"
                                onClick={resetPassword}
                                className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 opacity-60"
                                disabled
                                title="Coming soon"
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

                        {/* TODO: enable when Google OAuth is configured */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full opacity-60"
                            disabled
                            onClick={signInWithGoogle}
                            title="Coming soon"
                        >
                            Continue with Google
                        </Button>

                        <p className="mt-2 text-center text-sm text-gray-300">
                            New User?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-electric hover:text-electric/80"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="hidden lg:flex lg:col-span-3 bg-primary items-center justify-center">
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
