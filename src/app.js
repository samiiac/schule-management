import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authRouter } from "./modules/auth/route.js";
import { courseRouter } from "./modules/course/route.js";
import { departmentRouter } from "./modules/department/route.js";

export const app = express();


app.get("/health",()=>{
    return res.status(200).json({message:"Server running."})
})
app.use("/api/auth",authRouter)
app.use("/api/department",departmentRouter)
app.use("/api/course",courseRouter)

app.use(errorHandler)