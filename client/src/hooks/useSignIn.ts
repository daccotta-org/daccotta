import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { authClient } from "@/lib/auth-client"
import { SignInFormData } from "@/lib/validation"

export const useSignIn = (onSuccess?: () => void) => {
    return useMutation({
        mutationFn: async (data: SignInFormData) => {
            const result = await authClient.signIn.email({
                email: data.email,
                password: data.password,
            })
            if (result.error) {
                throw new Error(result.error.message || "Failed to sign in")
            }
            return result.data
        },
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
