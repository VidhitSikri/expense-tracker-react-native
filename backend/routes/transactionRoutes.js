import express from 'express';
import {
    getTransactionsByUser,
    createTransaction,
    deleteTransaction,
    getTransactionSummary
} from '../controllers/transactionController.js';

const router = express.Router();

router.get("/summary/:userId", getTransactionSummary);
router.get("/:userId", getTransactionsByUser);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
