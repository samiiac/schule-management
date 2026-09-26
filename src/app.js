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
app.use("/api/departments",departmentRouter) //adding s for resource rest
app.use("/api/courses",courseRouter)

app.use(errorHandler)