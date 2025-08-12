import express from 'express'
import {createTransactions, deleteTransaction, getSummaryByUserID, getTransactionsByUserId} from '../controller/transactionsController.js'
const router = express.Router();


router.get("/:userId" , getTransactionsByUserId);
router.post("/" , createTransactions);
router.delete("/:id", deleteTransaction);
router.get("/summary/:userId" , getSummaryByUserID);

export default router;