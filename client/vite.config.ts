import { defineConfig } from "vite"
import path from "path"
import { fileURLToPath } from "url"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(rootDir, "./src"),
        },
    },
})
