import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
