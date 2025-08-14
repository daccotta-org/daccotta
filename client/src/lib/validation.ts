import { z } from "zod"

// Shared email validation regex
export const EMAIL_REGEX =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

// Shared validation schemas
export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

// Username validation schema
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

export const signUpSchema = z
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

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

// Email validation utility function
export const isValidEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email)
}
