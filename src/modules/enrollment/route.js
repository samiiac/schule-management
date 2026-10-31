import Router from "express";
import { enrollmentController } from "./controller.js";
import { requirePermission, authenticate } from "../../middlewares/auth.js";
export const enrollmentRouter = Router();

enrollmentRouter.post(
  "/",
  authenticate,
  requirePermission(["enrollment:create:any", "enrollment:create:own"]),
  enrollmentController.create,
);
enrollmentRouter.get(
  "/all",
  authenticate,
  requirePermission(["enrollment:read:any"]),
  enrollmentController.listForAdmin,
);
enrollmentRouter.get(
  "/my",
  authenticate,
  requirePermission(["enrollment:read:own"]),
  enrollmentController.listForStudent,
);
enrollmentRouter.get(
  "/courses/:courseId",
  authenticate,
  requirePermission(["enrollment:read:taught", "enrollment:read:any"]),
  enrollmentController.listForIns,
);
enrollmentRouter.patch(
  "/:id",
  authenticate,
  requirePermission(["enrollment:update:taught", "enrollment:update:any"]),
  enrollmentController.update,
);
enrollmentRouter.delete(
  "/:id",
  authenticate,
  requirePermission(["enrollment:delete:own", "enrollment:delete:any"]),
  enrollmentController.delete,
);
