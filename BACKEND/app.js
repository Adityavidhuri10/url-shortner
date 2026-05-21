import express from 'express';
import dotenv from 'dotenv';

import connectDB from './src/config/mongo.config.js';
import shortUrl from './src/routes/shortUrl.route.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import errorMiddleware from './src/Middlewares/error.middleware.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/create', shortUrl);

app.get('/:shortUrl', redirectFromShortUrl);

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
    