import { useMutation } from "@tanstack/react-query"
import { signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-toastify"
import { auth } from "@/lib/firebase"
import { SignInFormData } from "@/lib/validation"

export const useSignIn = (onSuccess?: () => void) => {
    return useMutation({
        mutationFn: (data: SignInFormData) =>
            signInWithEmailAndPassword(auth, data.email, data.password),
        onSuccess: () => {
            toast.success("Successfully signed in!")
            onSuccess?.()
        },
        onError: (error) => {
            console.error("Failed to sign in:", error)
            toast.error("Incorrect email or password. Please try again.")
        },
    })
}
