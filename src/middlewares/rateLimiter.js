import rateLimit from "express-rate-limit";
import { rateLimited } from "../utils/appError";

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler:(req,res,next)=>next(new rateLimited())
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler:(error,req,res,next)=>next(new rateLimited())
});
