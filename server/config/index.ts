import { config } from "dotenv";
config();

const PORT = process.env.PORT || 8080;
const MONGO_URL = "YOUR_URI_HERE";
export { PORT, MONGO_URL };
