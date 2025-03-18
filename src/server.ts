import { employeeRouter } from './employee.routes';
import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { connectToDatabase } from './database';

dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been declared in the config");
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(() => {
        const app = express();
        app.use(cors());
        app.use(express.json()); // Middleware để parse JSON
        app.use('/employees', employeeRouter); // Thêm router

        app.listen(5200, () => {
            console.log('Server is running on port 5200');
        });
    })
    .catch((error: any) => {
        console.error("Failed to connect to the database:", error);
    });