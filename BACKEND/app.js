import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './src/config/mongo.config.js';
import shortUrl from './src/routes/shortUrl.route.js';
import authRouter from './src/routes/auth.route.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import errorMiddleware from './src/Middlewares/error.middleware.js';

dotenv.config();

const app = express();

// Configure CORS to permit credentials (cookies) in requests and response headers
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean),
    credentials: true
}));

// Parsers for incoming request formats
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable parser middleware for signed/unsigned cookie access
app.use(cookieParser());

// Route Declarations
app.use('/api/create', shortUrl);
app.use('/api/auth', authRouter); // Integrate authentication routes

// Redirection handler for shortened links
app.get('/:shortUrl', redirectFromShortUrl);

// Error Middleware (Must be attached last to capture all upstream controller exceptions)
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });