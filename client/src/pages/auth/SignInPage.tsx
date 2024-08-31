import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { auth } from "../../lib/firebase"
import {
    signInWithEmailAndPassword,
    // signInWithPopup,
    // GoogleAuthProvider,
    // OAuthProvider,
} from "firebase/auth"
import { useMutation } from "@tanstack/react-query"
//import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { Link } from "react-router-dom"
import "../../index.css"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { checkEmailExists } from "@/services/userService"
import { useState, useEffect } from "react"
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"

export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})
export type SignInFormData = z.infer<typeof signInSchema>
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})
export type SignInFormData = z.infer<typeof signInSchema>

const SignInPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    })

    const [isEmailExists, setIsEmailExists] = useState<boolean | null>(null)
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)

    //email check
    const email = watch("email")

    useEffect(() => {
        const checkEmailExistence = async () => {
            if (email && email.endsWith("@gmail.com")) {
                setIsCheckingEmail(true)
                try {
                    const exists = await checkEmailExists(email)
                    setIsEmailExists(exists)
                } catch (error) {
                    console.error("Error checking email existence:", error)
                    setIsEmailExists(null)
                } finally {
                    setIsCheckingEmail(false)
                }
            } else {
                setIsEmailExists(null)
            }
        }
        const debounce = setTimeout(checkEmailExistence, 500)
        return () => clearTimeout(debounce)
    }, [email])

    const signInMutation = useMutation({
        mutationFn: (data: SignInFormData) =>
            signInWithEmailAndPassword(auth, data.email, data.password),
        onSuccess: () => {
            // Handle successful sign-in
        },
        onError: (error) => {
            console.error("Failed to sign in:", error)
        },
    })

    const onSubmit = (data: SignInFormData) => {
        signInMutation.mutate(data)
    }

    // const signInWithGoogle = async () => {
    //     try {
    //         const provider = new GoogleAuthProvider()
    //         await signInWithPopup(auth, provider)
    //         // Handle successful sign-in
    //     } catch (error) {
    //         console.error("Failed to sign in with Google:", error)
    //     }
    // }

    // const signInWithApple = async () => {
    //     try {
    //         const provider = new OAuthProvider("apple.com")
    //         await signInWithPopup(auth, provider)
    //         // Handle successful sign-in
    //     } catch (error) {
    //         console.error("Failed to sign in with Apple:", error)
    //     }
    // }


    return (
        <div className="w-full lg:grid lg:grid-cols-5 h-screen">
            {/* Form Section */}
            <div className="h-full flex flex-col items-center justify-evenly  p-8  lg:p-20 lg:col-span-2 bg-main">
                <h2 className="text-3xl font-bold mb-2  ">Sign In</h2>
                <img
                    src="/movie_signup.svg"
                    alt="Sign In Illustration"
                    className="w-[400px] h-auto lg:hidden"
                />
                <div className="flex flex-col gap-2  w-full">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full max-w-md"
                    >
                        <div className="form-control relative">
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
                                {email && email.endsWith("@gmail.com") && (
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
                                        {errors.email.message}
                                    </span>
                                </label>
                            )}
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="input bg-transparent input-bordered w-full"
                                {...register("password")}
                            />
                            {errors.password && (
                                <span className="text-error">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>
                        <div className="form-control mb-4">
                            <button
                                className="btn btn-primary text-white w-full"
                                type="submit"
                                disabled={signInMutation.isPending}
                            >
                                {signInMutation.isPending
                                    ? "Signing In..."
                                    : "Sign In"}
                            </button>
                        </div>
                        <div className="divider">OR</div>

                        <p className="lg:mt-4 mt-12 text-center">
                            New User?{" "}
                            <Link to="/signup" className="link link-primary">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Image Section */}
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:col-span-3 bg-[#FFFAA0]">
                <div className="w-full h-full flex items-center justify-center">
                    <img
                        src="/movie_signup.svg"
                        alt="Sign In Illustration"
                        className="w-[400px] h-auto"
                    />
                </div>
            </div>
        </div>
    )
}

export default SignInPage
