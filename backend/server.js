import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoutes.js";




dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

const PORT = process.env.PORT || 5001;

app.use("/api/transactions", transactionRoutes);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});