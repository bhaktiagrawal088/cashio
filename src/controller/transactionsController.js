import { sql } from '../config/db.js';

export async function  getTransactionsByUserId(req, res) {
    try {
        const {userId} = req.params;
        const transactions = await sql`
            SELECT * FROM transactions 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
        `

        res.status(200).json(transactions);
        
    } catch (error) {
        console.log("Error getting the transactions", error);
        res.status(500).json({message: "Internal  Server Error "})
    }
}

export async function createTransactions (req, res) {
        try {
            const {user_id, title, category , amount } = req.body;
    
            if(!user_id || !title || ! category || amount === undefined){
                return res.status(400).json( {message : "All field are required" })
            }
    
            const transaction = await sql`
            INSERT INTO transactions(user_id, title , category, amount)
            VALUES (${user_id} , ${title} , ${category}, ${amount})
            RETURNING *
            `;
    
            console.log(transaction);
            res.status(201).json(transaction[0]);
        } catch (error) {
            console.log("Error creating the transactions");
            return res.status(500).json({message : "Internal server error"})
        }
}

export async function deleteTransaction (req, res)  {
    try {
        const {id} = req.params;
        
        if(isNaN(parseInt(id))){
            return res.status(400).json({message: "Invalid transaction id"});
        }

        const result = await sql`
        DELETE FROM transactions
        WHERE id = ${id}
        RETURNING *
        `;

        if(result.length === 0){
            return res.status(404).json({message : "Transaction not found"})
        }
        res.status(200).json({message : "Successfully Deleted"});
    } catch (error) {
        console.log("Error deleting the transaction", error);
        res.status(500).json({message : "Internal Server Error"})
    }
}

export async function getSummaryByUserID  (req,res) {
    try {
        const {userId} = req.params;

        // if (isNaN(parseInt(userId))) {
        //     return res.status(400).json({ message: "Invalid userId" });
        // }
        
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ message: "Invalid userId" });
        }



        const balancedResult = await sql `
            SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
        `

        const  incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `

        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0 ) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
        `

        res.status(200).json({
            balance : balancedResult[0].balance,
            income : incomeResult[0].income,
            expenses : expensesResult[0].expenses,
        })

        
    } catch (error) {
        console.log("Error getting the summary", error);
        res.status(500).json({message : "Internal Sever Error"})
    }
}