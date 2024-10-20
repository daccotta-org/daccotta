import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import "../../index.css"

import {
    checkEmailExists,
    checkUsernameAvailability,
    useSignUp,
} from "../../services/userService"
import { z } from "zod"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "../../lib/firebase" // Ensure you have Firebase initialized
import axios from "axios"
import toast from "react-toastify"

// Schema definitions
const usernameSchema = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must not exceed 30 characters")
    .regex(
        /^[a-zA-Z0-9][a-zA-Z0-9._]*[a-zA-Z0-9]$/,
        "Username must start and end with a letter or number, and can only contain letters, numbers, periods, and underscores"
    )
    .refine(
        (username) => !/(\.\.|\_{2})/.test(username),
        "Username cannot contain consecutive periods or underscores"
    )
    .refine(
        (username) => !/\s/.test(username),
        "Username cannot contain spaces"
    )

const extendedSignUpSchema = z
    .object({
        username: usernameSchema,
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string(),
        // age: z
        //     .number()
        //     .min(13, "You must be at least 13 years old")
        //     .max(120, "Invalid age"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

type ExtendedSignUpFormData = z.infer<typeof extendedSignUpSchema>
const LoadingSpinner: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="border-4 border-primary border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        </div>
    )
}
console.log("Hello", import.meta.env.VITE_PROJECT_ID)
const SignUp: React.FC = () => {
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<
        boolean | null
    >(null)
    const [isLoading, setIsLoading] = useState(false)

    const [isChecking, setIsChecking] = useState(false)
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
        null
    )
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
        trigger,
    } = useForm<ExtendedSignUpFormData>({
        resolver: zodResolver(extendedSignUpSchema),
    })
    const createUser = useSignUp()

    // useEffect to check if email is available
    const username = watch("username")
    useEffect(() => {
        const checkAvailability = async () => {
            if (username && username.length >= 3) {
                setIsChecking(true)
                try {
                    // First, validate the username against the schema
                    await trigger("username")
                    if (!errors.username) {
                        const isAvailable =
                            await checkUsernameAvailability(username)
                        setIsUsernameAvailable(isAvailable)
                    } else {
                        setIsUsernameAvailable(false)
                    }
                } catch (error) {
                    console.error(
                        "Error checking username availability:",
                        error
                    )
                    setIsUsernameAvailable(null)
                } finally {
                    setIsChecking(false)
                }
            } else {
                setIsUsernameAvailable(null)
            }
        }

        const debounce = setTimeout(checkAvailability, 500)
        return () => clearTimeout(debounce)
    }, [username, trigger, errors.username])

    const onSubmit = async (values: ExtendedSignUpFormData) => {
        if (!isUsernameAvailable) {
            setError("username", {
                type: "manual",
                message: "Username is not available",
            })
            return
        }

        if (!isEmailAvailable) {
            setError("email", {
                type: "manual",
                message: "Email is already in use",
            })
            return
        }

        try {
            await createUser.mutate(values)
        } catch (error) {
            setIsLoading(false)
            // Handle error
        }
    }

    //userEffect to check if email is available
    const email = watch("email")

    useEffect(() => {
        const checkEmailAvailability = async () => {
            if (email && email.endsWith("@gmail.com")) {
                setIsCheckingEmail(true)
                try {
                    const emailExists = await checkEmailExists(email)
                    setIsEmailAvailable(!emailExists)
                } catch (error) {
                    console.error("Error checking email availability:", error)
                    setIsEmailAvailable(null)
                } finally {
                    setIsCheckingEmail(false)
                }
            } else {
                setIsEmailAvailable(null)
            }
        }

        const debounce = setTimeout(checkEmailAvailability, 500)
        return () => clearTimeout(debounce)
    }, [email])

    const preventPaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
    }

    const signUpWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        try {
            const result = await signInWithPopup(auth, provider)
            const token = await result.user.getIdToken() // Get the ID token

            // Send the token to your backend for sign-up
            const response = await axios.post("http://your-backend-url/api/auth/google/signup", { token })
            console.log("User signed up:", response.data)
            toast.success("Successfully signed up with Google!")
            reset() // Ensure you reset the form after successful sign-up
        } catch (error) {
            console.error("Failed to sign up with Google:", error.message)
            toast.error("Failed to sign up with Google. Please try again.")
        }
    }

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-5">
            <div className="flex flex-col items-center justify-center py-12 lg:py-2 lg:col-span-2 bg-background text-white">
                <div className="mx-auto w-full max-w-md px-4">
                    <h2 className="text-3xl font-bold text-center self-start mb-8 lg:mb-2">
                        Sign Up
                    </h2>
                    <p className="text-center text-white mb-2">
                        Enter your details below to create a new account
                    </p>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
                        <div className="form-control relative">
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
                                        ) : isUsernameAvailable ? (
                                            <FaCheckCircle className="text-success" />
                                        ) : (
                                            <FaTimesCircle
                                                className="text-error tooltip tooltip-top"
                                                data-tip="Invalid username"
                                            />
                                        )}
                                    </span>
                                )}
                            </div>
                            {errors.username && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.username.message}
                                    </span>
                                </label>
                            )}
                            {isUsernameAvailable === false &&
                                !errors.username && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            Username is not available
                                        </span>
                                    </label>
                                )}
                        </div>
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
                                        {errors.email.message}
                                    </span>
                                </label>
                            )}
                            {isEmailAvailable === false && !errors.email && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        Email is already in use
                                    </span>
                                </label>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="input input-bordered bg-transparent w-full"
                                {...register("password")}
                                onPaste={preventPaste}
                            />
                            {errors.password && (
                                <span className="text-error">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Confirm Password
                                </span>
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="input input-bordered bg-transparent w-full"
                                {...register("confirmPassword")}
                                onPaste={preventPaste}
                            />
                            {errors.confirmPassword && (
                                <span className="text-error">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        <div className="form-control mt-6">
                            <button
                                className="btn btn-primary text-white w-full"
                                type="submit"
                                disabled={
                                    createUser.isPending ||
                                    isChecking ||
                                    !isUsernameAvailable ||
                                    isCheckingEmail ||
                                    !isEmailAvailable ||
                                    isLoading
                                }
                            >
                                {isLoading ? "Loading..." : "Sign Up"}
                            </button>
                            <p className="lg:mt-4 mt-12 text-center">
                                Already have an account?{" "}
                                <Link
                                    to="/signin"
                                    className="link link-primary"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                        <div className="mt-4">
                            <button
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded hover:bg-blue-600"
                                type="button"
                                onClick={signUpWithGoogle}
                            >
                                Sign Up with Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="hidden lg:flex lg:items-center lg:justify-center bg-[#E6E3D3] lg:col-span-3">
                <div className="w-full h-full flex items-center justify-center">
                    <img
                        src="movie_signup.svg"
                        alt="Sign In Illustration"
                        className="w-[400px] h-auto"
                    />
                </div>
            </div>

            {isLoading && <LoadingSpinner />}
        </div>
    )
}

export default SignUp
