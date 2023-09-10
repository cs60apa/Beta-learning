import mongoose from "mongoose";
require("dotenv").config();

const dbUrl:string = process.env.DB_URL || '';

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl).then((data:any) => {
            console.log(`MongoDB Connected: ${data.connection.host}`);
        } catch (error) {
            console.log(error.message);
        }
    }

};