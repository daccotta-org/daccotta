import { useState, useEffect } from "react"
import { checkUsernameAvailability } from "@/services/userService"
import { FieldErrors, UseFormTrigger } from "react-hook-form"

export interface UseUsernameValidationReturn {
    isUsernameAvailable: boolean | null
    isChecking: boolean
}

export const useUsernameValidation = (
    username: string,
    trigger: UseFormTrigger<any>,
    errors: FieldErrors
): UseUsernameValidationReturn => {
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<
        boolean | null
    >(null)
    const [isChecking, setIsChecking] = useState(false)

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
                    setIsUsernameAvailable(false)
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

    return { isUsernameAvailable, isChecking }
}
