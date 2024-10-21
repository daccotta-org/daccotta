import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle, Eye, EyeOff, XCircle } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

import {
    checkEmailExists,
    checkUsernameAvailability,
    useSignUp,
    createUserWithGoogle
} from "../../services/userService"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth" // Import for Google auth
import { auth } from "../../lib/firebase" // Adjust the import path if needed
import { toast } from "react-toastify"

// Schema definitions...
const googleProvider = new GoogleAuthProvider()

// Schema definitions (unchanged)
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
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

type ExtendedSignUpFormData = z.infer<typeof extendedSignUpSchema>

const LoadingSpinner: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
    )
}

const SignUp: React.FC = () => {
    const [hidden, setHidden] = useState(true)
    const [confirmHidden, setConfirmHidden] = useState(true)
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

    const username = watch("username")
    const email = watch("email")

    useEffect(() => {
        const checkAvailability = async () => {
            if (username && username.length >= 3) {
                setIsChecking(true)
                try {
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

    const preventPaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
    }

    const handleGoogleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user

            if (!user.email) {
                toast.error("User email is not available");
                return;
            }

            // Optionally send user data to backend
            await createUserWithGoogle(user.email, username || user.displayName || user.email.split('@')[0]);

            toast.success("Successfully signed up with Google")

            // Optionally save user to Firestore
        } catch (error) {
            console.error("Error signing up with Google:", error)
            toast.error("Error signing up with Google")
        }
    }

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-5">
            <div className="lg:col-span-2 h-screen flex flex-col items-center font-heading justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold">
                            Sign Up
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-300">
                            Enter your details below to create a new account
                        </p>
                    </div>
                    <form
                        className="mt-8 space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4">
                            <div>
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
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            ) : isUsernameAvailable ? (
                                                <CheckCircle
                                                    className="text-green-500"
                                                    size={16}
                                                />
                                            ) : (
                                                <XCircle
                                                    className="text-red-500"
                                                    size={16}
                                                />
                                            )}
                                        </span>
                                    )}
                                </div>
                                {errors.username && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.username.message}
                                    </p>
                                )}
                                {isUsernameAvailable === false &&
                                    !errors.username && (
                                        <p className="mt-2 text-sm text-red-500">
                                            Username is not available
                                        </p>
                                    )}
                            </div>

                            <div>
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
                                    {email && email.endsWith("@gmail.com") && (
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            {isCheckingEmail ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            ) : isEmailAvailable === true ? (
                                                <CheckCircle
                                                    className="text-green-500"
                                                    size={16}
                                                />
                                            ) : isEmailAvailable === false ? (
                                                <XCircle
                                                    className="text-red-500"
                                                    size={16}
                                                />
                                            ) : null}
                                        </span>
                                    )}
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                                {isEmailAvailable === false &&
                                    !errors.email && (
                                        <p className="mt-2 text-sm text-red-500">
                                            Email is already in use
                                        </p>
                                    )}
                            </div>

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
                                        onPaste={preventPaste}
                                    />
                                    <div
                                        className="absolute top-0 p-2 right-2 h-full aspect-square flex justify-center items-center z-10 hover:cursor-pointer"
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
                                <Label
                                    htmlFor="confirmPassword"
                                    className="sr-only"
                                >
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={
                                            confirmHidden ? "password" : "text"
                                        }
                                        placeholder="Confirm Password"
                                        className="bg-gray-800 text-white"
                                        {...register("confirmPassword")}
                                        onPaste={preventPaste}
                                    />
                                    <div
                                        className="absolute top-0 p-2 right-2 h-full aspect-square flex justify-center items-center z-10 hover:cursor-pointer"
                                        onClick={() =>
                                            setConfirmHidden(!confirmHidden)
                                        }
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
                            </Button>
                        </div>

                        <div>
                            { <Button
                                type="button"
                                className="w-full bg-blue-500 hover:bg-blue-400"
                                onClick={handleGoogleSignUp}
                            >
                                <img
                                    src="/google.svg" // Adjust the path as needed
                                    alt="Google Logo"
                                    className="h-5 w-5 mr-2" // Adjust size as needed
                                />
                                <span>Sign Up using Google</span>
                            </Button> }
                        </div>
                    </form>
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
                    src="movie_signup.svg"
                    alt="Sign In Illustration"
                    className="w-[400px] h-auto"
                />
            </div>

            {isLoading && <LoadingSpinner />}
        </div>
    )
}

export default SignUp
