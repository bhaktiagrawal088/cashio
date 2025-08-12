import express from "express";
import dotenv from 'dotenv';
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from './route/transactionsRoute.js'
import {initDB} from './config/db.js'

const app = express();
dotenv.config();

// middleware
app.use(rateLimiter);
app.use(express.json());

// custom simple middleware
app.use((req, res, next) => {
    console.log("Hy we hit the req and method is " , req.method);
    next();
})

// app.get('/' , (req,res) => {
//     res.send("It's Working");
// })

app.use("/api/transactions", transactionsRoute);

const PORT = process.env.PORT || 5001;


initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT:", PORT)
    })
})
