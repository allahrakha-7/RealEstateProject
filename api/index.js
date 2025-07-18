import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'https://real-estate-web-app-puce.vercel.app/',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

mongoose
.connect(process.env.MONGO)
.then(() => {
  console.log('Connected to MongoDB!');
})
.catch((err) => {
  console.log(err);
});

app.use(cors({
  origin: [
    'https://real-estate-web-16sb7p5ir-tech-captains-projects.vercel.app',
    'https://real-estate-web-app-puce.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173' 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  optionsSuccessStatus: 200 
}));

app.use(express.json());

app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Real Estate API is running!',
    status: 'success'
  });
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});