import {neon} from '@neondatabase/serverless';

import "dotenv/config";

// creates SQL connection using the database
export const sql =neon(process.env.DATABASE_URL);

export async function initDB(){
    try {
        await sql `CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;

        // DECIMAL(10,2) : means a fixed-point number with 
        // 10 digits total 2 digits after the decimal
        // the max value it can be store is 99999999.99 (8 digits before the decimal , 2 digits after)


        console.log("Database initialized successfully");
    } catch (error) {
        console.log("Error initializing DB", error);
        process.exit(1); // status code 1 means failure , 0 means success
    }
}