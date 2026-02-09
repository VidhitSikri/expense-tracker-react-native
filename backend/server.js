import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import { initDB } from "./config/db.js";




dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5001;

app.get("/api/transactions/:userId" , async (req, res) => {
    try {

        const { userId } = req.params;
        
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC

        `;

        res.status(200).json(transactions);
        
    } catch (error) {
        console.log("Error getting transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


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

app.delete("/api/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if(isNaN(id)) {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }

        const result = await sql`   
            DELETE FROM transactions WHERE id = ${id}
            RETURNING *
        `;

        if(result.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        console.log("Transaction deleted:", result);
        res.status(200).json(result[0]);
    } catch (error) {
        console.log("Error deleting transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/transactions/summary/:userId", async (req, res) => {
    try {
        const { userId } = req.params;


        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
        `;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId}
            AND amount > 0
        `;

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId}
            AND amount < 0
        `;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        });

    }catch (error) {
        console.log("Error getting transaction summary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});