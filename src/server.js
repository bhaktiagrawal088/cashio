import express from "express";
import dotenv from 'dotenv';
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from './route/transactionsRoute.js'
import {initDB} from './config/db.js'
import job from "./config/cron.js";

const app = express();
dotenv.config();

if(process.env.NODE_ENV === 'production') job.start();

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

app.get("/api/health" , (req , res) => {
    res.status(200).json({status : "All right"})
})
app.use("/api/transactions", transactionsRoute);

const PORT = process.env.PORT || 5001;


initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT:", PORT)
    })
})
