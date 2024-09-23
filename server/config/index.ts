import { config } from "dotenv";
config();

const PORT = process.env.PORT || 8080;
const password = process.env.MONGO_PASSWORD;
const MONGO_URL = "";
export { PORT, MONGO_URL };
