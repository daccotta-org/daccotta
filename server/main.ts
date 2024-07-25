import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./connections/connectToDB";
import { PORT } from "./config";
import { userRoutes } from "./routes/userRoutes";
import { groupRoutes } from "./routes/groupRoutes";
import { listRoutes } from "./routes/listRoutes";
dotenv.config();

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/api/user',userRoutes);
app.use('/api/group',groupRoutes);
app.use('/api/list',listRoutes);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});