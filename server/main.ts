import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./connections/connectToDB";
import { PORT } from "./config";
dotenv.config();

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});