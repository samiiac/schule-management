import z from "zod";
import { changePasswordSchema, createUserSchema, loginSchema } from "./schema.js";
import { authService } from "./service.js";

export const authController = {
  register: async (req, res) => {
    const validatedPayload = createUserSchema.parse(req.body);
    const user = await authService.register(validatedPayload);
    return res.status(200).json({ success: true, user });
  },
  login: async (req, res) => {
    const payload = loginSchema.parse(req.body);
    const { user, tokenPayload } = await authService.login(payload);
    return res.status(200).json({ success: true, user, tokenPayload });
  },
  changePassword:async (req,res)=>{
    const payload = changePasswordSchema.parse(req.body);
   await authService.changePassword({user:req.user,payload})
  },
  refresh:async(req,res)=>{
    const payload = changePasswordSchema.parse(req.body);
    await authService.createNewTokens(payload)
  }
};
