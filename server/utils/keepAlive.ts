import axios from "axios" // Import axios

export function keepAlive() {
    setInterval(async () => {
        try {
            const url = `https://daccotta-back.onrender.com/ping` // Change this to your deployed server's URL when deploying

            const response = await axios.get(url)

            // Log the response
            console.log(`Ping successful: ${response.data}`)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                console.error("Axios error:", error.message)
            } else if (error instanceof Error) {
                // Handle general errors
                console.error("Error in keepAlive function:", error.message)
            } else {
                console.error("Unknown error in keepAlive function")
            }
        }
    }, 840000) // 14 minutes in milliseconds
}
