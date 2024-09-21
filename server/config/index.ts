import { config } from "dotenv";
config();

const PORT = process.env.PORT || 8080;
const password = process.env.MONGO_PASSWORD;
const MONGO_URL = `mongodb+srv://daccottapvt:${password}@cluster0.7u21woq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
export { PORT, MONGO_URL };
