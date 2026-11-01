import z from "zod";
import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
} from "./schema.js";
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
  changePassword: async (req, res) => {
    const payload = changePasswordSchema.parse(req.body);
    const  tokenPayload  = await authService.changePassword({
      user: req.user,
      payload,
    });
    return res.status(200).json({ success: true,  tokenPayload });
  },
  refresh: async (req, res) => {
    const payload = changePasswordSchema.parse(req.body);
    const tokenPayload  = await authService.createNewTokens(payload);
    return res.status(200).json({ success: true, tokenPayload });
  },
};
