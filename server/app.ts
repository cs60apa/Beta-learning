require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middleware/error';
import ErrorHandler from './utils/ErrorHandler';
import userRouter from './routes/user.route';
// body-parser is deprecated, so we use express.json() instead
app.use(express.json({limit: '50mb'}));

// app.use(bodyParser.json());
app.use(cookieParser());

// cors is a middleware that allows us to make requests from the client
app.use(cors({
    origin: process.env.ORIGIN,
})); 

// routes
app.use("/api/v1", userRouter);

// Testing api
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: 'API is working'
    });
})

// Unknow Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

// Error Middleware
export default ErrorHandler






