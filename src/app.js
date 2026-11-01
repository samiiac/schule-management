import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authRouter } from "./modules/auth/route.js";
import { courseRouter } from "./modules/course/route.js";
import { deptRouter } from "./modules/department/route.js";
import { enrollmentRouter } from "./modules/enrollment/route.js";
import helmet from 'helmet';
import { authenticate } from "./middlewares/auth.js";
import { authLimiter } from "./middlewares/rateLimiter.js";
import { passwordChange } from "./middlewares/passwordChange.js";

export const app = express();
app.use(helmet());
app.use(express.json())
app.get("/health",(req,res)=>{
    return res.status(200).json({message:"Server running."})
})
app.use("/api/auth",authLimiter,authRouter)
app.use("/api/departments",authenticate,passwordChange,deptRouter) //adding s for resource rest
app.use("/api/courses",authenticate,passwordChange,courseRouter)
app.use("/api/enrollments",enrollmentRouter)


app.use(errorHandler)