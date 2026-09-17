import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();


app.get("/health",()=>{
    return res.status(200).json({message:"Server running."})
})

app.use(errorHandler)