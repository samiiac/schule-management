import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authRouter } from "./modules/auth/route.js";

export const app = express();


app.get("/health",()=>{
    return res.status(200).json({message:"Server running."})
})
app.use("/api/auth",authRouter)

app.use(errorHandler)