import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import { initDB } from "./config/db.js";




dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5001;


app.post("/api/transactions", async (req, res) => {
    try {
        const { title, amount, category, user_id } = req.body;

        if(!title || !amount || !category || !user_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const transaction = await sql`
            INSERT INTO transactions (title, amount, category, user_id)
            VALUES (${title}, ${amount}, ${category}, ${user_id})
            RETURNING *
        `;

        console.log("Transaction created:", transaction);
        res.status(201).json(transaction[0]);


    } catch (error) {
        console.log("Error creating transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});