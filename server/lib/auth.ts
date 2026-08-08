import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { bearer } from "better-auth/plugins"
import { client, getAuthDb } from "./mongo"

const db = await getAuthDb()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        // Standalone Mongo may not support transactions
        client,
        transaction: false,
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [
        process.env.CLIENT_URL || "http://localhost:5173",
    ].filter(Boolean),
    emailAndPassword: {
        enabled: true,
        // TODO: wire SMTP/Resend for forgot password
        // sendResetPassword: async ({ user, url }) => {
        //   await sendEmail({ to: user.email, subject: "Reset password", html: `Click <a href="${url}">here</a>` })
        // },
    },
    // TODO: enable Google OAuth — needs GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
    // socialProviders: {
    //     google: {
    //         clientId: process.env.GOOGLE_CLIENT_ID as string,
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    //     },
    // },
    plugins: [bearer()],
})

export type Session = typeof auth.$Infer.Session
