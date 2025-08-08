import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoute from "./routes/authRoute";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth/", authRoute);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
