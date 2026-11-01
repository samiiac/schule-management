import Router from "express";
import { enrollmentController } from "./controller.js";
import { requirePermission, authenticate } from "../../middlewares/auth.js";
import { generalLimiter } from "../../middlewares/rateLimiter.js";
import { passwordChange } from "../../middlewares/passwordChange.js";
export const enrollmentRouter = Router();

enrollmentRouter.post(
  "/",
  generalLimiter,
  authenticate,
  passwordChange,
  requirePermission(["enrollment:create:any", "enrollment:create:own"]),
  enrollmentController.create,
);
enrollmentRouter.get(
  "/all",
  authenticate,
  passwordChange,
  requirePermission(["enrollment:read:any"]),
  enrollmentController.listForAdmin,
);
enrollmentRouter.get(
  "/my",
  authenticate,
  passwordChange,
  requirePermission(["enrollment:read:own"]),
  enrollmentController.listForStudent,
);
enrollmentRouter.get(
  "/courses/:courseId",
  authenticate,
  passwordChange,
  requirePermission(["enrollment:read:taught", "enrollment:read:any"]),
  enrollmentController.listForIns,
);
enrollmentRouter.patch(
  "/:id",
  authenticate,
  passwordChange,
  requirePermission(["enrollment:update:taught", "enrollment:update:any"]),
  enrollmentController.update,
);
enrollmentRouter.delete(
  "/:id",
  authenticate,
  passwordChange,
  requirePermission(["enrollment:delete:own", "enrollment:delete:any"]),
  enrollmentController.delete,
);
