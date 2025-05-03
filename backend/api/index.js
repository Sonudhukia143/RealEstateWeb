import express from 'express';
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import logInRouter from '../routes/login.js';
import logout from '../routes/logOut.js';
import signUpRouter from '../routes/signUp.js';
import verifyMail from '../routes/verify.js';
import requestVerification from '../routes/requestVerify.js';
import changePassword from '../routes/changePassword.js';
import updateProfile from '../routes/updateProfile.js';
import addInfo from '../routes/addInfo.js';
import fetchInfo from '../routes/getInfo.js';
import authMiddleware from '../middlewares/checkAuth.js';
import sendOtp from '../routes/otpRequest.js';
import verifyOtp from '../routes/otpVerify.js';

const connectDb = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    console.log("Connecting to local database");

    try {
        await mongoose.connect(process.env.MONGO_ATLAS_URL);
        console.log("Connected to the database.");
    } catch (error) {
        console.log("Error in establishing connection with the database: " + error);
    }
};

const app = express();
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());
//app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:5173','http://localhost:5174','https://maisenmonde.netlify.app','https://accounts.google.com'],   
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization','X-Requested-With'],
};
app.use(cors(corsOptions));

app.use('/api/login', logInRouter);
app.use('/api/logout', logout);
app.use('/api/signin' ,signUpRouter);
app.use('/api/verify-email', verifyMail);
app.use('/api/fetch-info', authMiddleware ,fetchInfo);
app.use('/api/request-verification', authMiddleware ,requestVerification);
app.use('/api/change-pass',authMiddleware,changePassword);
app.use('/api/update-profile',authMiddleware,updateProfile);
app.use('/api/add-info',authMiddleware,addInfo);
app.use('/api/send-otp',sendOtp);
app.use('/api/verify-otp',verifyOtp);
app.get('/api/test', (req,res) => {
    res.send("Hello, The Backend Is Working");
});

app.use('*', (req,res) => {
    res.status(404).send("Could not find the page");
});


  export default async function handler (req, res) {
      await connectDb();

     return app(req, res);
  }; 