import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

const app = express();

app.use(express.json());

// eslint-disable-next-line no-undef
mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('Connected to MongoDB!');
})
.catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});


// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});