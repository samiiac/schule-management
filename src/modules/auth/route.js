import Router from express
import { authController } from "./controller";
export const authRouter = Router();

authRouter.post("/register",authController.register);
authRouter.post("/login",authController.login) ;
authRouter.post("/change-password",authController.changePassword);
authRouter.post("/refresh",authController.refresh);