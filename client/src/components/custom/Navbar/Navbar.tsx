import { FC } from "react"
import { Link } from "react-router-dom"
import { List, Search, UserRound } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

const Navbar: FC = () => {
    const { isSignedIn, signOut } = useAuth()

    return (
        <header className="flex w-screen items-center justify-between gap-4 border-b border-border bg-background px-4 py-2">
            <Button variant="secondary" size="icon" aria-label="Menu">
                <List />
            </Button>
            <a
                href="/"
                className="inline-flex items-center gap-1 text-xl font-bold text-foreground"
            >
                <span>dacc</span>
                <motion.span
                    initial={{ opacity: 0.6 }}
                    whileHover={{
                        scale: 1.4,
                        transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.9 }}
                    whileInView={{ opacity: 1 }}
                    className="inline-flex"
                >
                    <Search className="h-5 w-5 text-yellow-400" />
                </motion.span>
                <span>tta</span>
            </a>
            <div>
                {isSignedIn ? (
                    <Button variant="secondary" onClick={() => signOut()}>
                        Sign out
                    </Button>
                ) : (
                    <Button variant="secondary" size="icon" asChild>
                        <Link to="/signup" aria-label="Sign up">
                            <UserRound />
                        </Link>
                    </Button>
                )}
            </div>
        </header>
    )
}

export default Navbar
