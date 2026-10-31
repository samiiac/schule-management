import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authRouter } from "./modules/auth/route.js";
import { courseRouter } from "./modules/course/route.js";
import { deptRouter } from "./modules/department/route.js";
import { enrollmentRouter } from "./modules/enrollment/route.js";
import helmet from 'helmet';

export const app = express();
app.use(helmet());
app.use(express.json())
app.get("/health",(req,res)=>{
    return res.status(200).json({message:"Server running."})
})
app.use("/api/auth",authRouter)
app.use("/api/departments",deptRouter) //adding s for resource rest
app.use("/api/courses",courseRouter)
app.use("/api/enrollments",enrollmentRouter)


app.use(errorHandler)