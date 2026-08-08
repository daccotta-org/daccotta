import { useState, useEffect } from "react"
import { checkEmailExists } from "@/services/userService"
import { isValidEmail } from "@/lib/validation"

export interface UseEmailAvailabilityReturn {
    isEmailAvailable: boolean | null
    isCheckingEmail: boolean
}

export const useEmailAvailability = (
    email: string
): UseEmailAvailabilityReturn => {
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
        null
    )
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)

    useEffect(() => {
        const checkEmailAvailability = async () => {
            if (email && isValidEmail(email)) {
                setIsCheckingEmail(true)
                try {
                    const emailExists = await checkEmailExists(email)
                    setIsEmailAvailable(!emailExists) // Available if NOT exists
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

    return { isEmailAvailable, isCheckingEmail }
}
