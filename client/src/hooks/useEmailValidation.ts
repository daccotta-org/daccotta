import { useState, useEffect } from "react"
import { checkEmailExists } from "@/services/userService"
import { isValidEmail } from "@/lib/validation"

export interface UseEmailValidationReturn {
    isEmailExists: boolean | null
    isCheckingEmail: boolean
}

export const useEmailValidation = (email: string): UseEmailValidationReturn => {
    const [isEmailExists, setIsEmailExists] = useState<boolean | null>(null)
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)

    useEffect(() => {
        const checkEmailExistence = async () => {
            if (email && isValidEmail(email)) {
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

    return { isEmailExists, isCheckingEmail }
}
