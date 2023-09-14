require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError }  from "../middleware/catchAsyncError"
import jwt, { Secret } from 'jsonwebtoken';

// register user => /api/v1/register
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;

}

export const registerUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name,email,password} = req.body;

        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist){
            return next(new ErrorHandler('Email already exist', 400))
        };

        const user:IRegistrationBody = {
            name,
            email,
            password,
        }

        const activationToken = createActivationToken(user);
        
    } catch (error:any){
        return next(new ErrorHandler(error.message, 400))
    }
})

// create activation token
interface IActivateToken{
    token: string;
    activationCode: string;
}

export const createActivationToken = (user:any):IActivateToken => {
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();  

    const token = jwt.sign({
        user,activationCode
    }, process.env.ACTIVATION_SECRET as Secret,{
        expiresIn: '5m' // 5 minutes
    }  )

    return {token, activationCode}
}   