require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError }  from "../middleware/catchAsyncError"
import jwt, { Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';
import sendMail from "../utils/sendMail";

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

        // create activation token
        const activationToken = createActivationToken(user);

         const activationCode = activationToken.activationCode;

         const data = {user: {name:user.name}, activationCode}

         const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);

         try{
            await sendMail({
                email: user.email,
                subject: "Account Activation",
                template: "activation-mail.ejs",
                data,
            });
            } catch (error){
                
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }


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