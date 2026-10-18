import Router from "express";
import { enrollmentController } from "./controller";
import { requirePermission, authenticate } from "../../middlewares/auth";
export const enrollmentRouter = Router();

enrollmentRouter.post(
  "/",
  requirePermission(["enrollment:create:any", "enrollment:create:own"]),
  enrollmentController.create,
);
enrollmentRouter.get(
  "/all",
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
  requirePermission(["enrollment:read:taught", "enrollment:read:any"]),
  enrollmentController.listForIns,
);
enrollmentRouter.patch(
  "/:id",
  requirePermission(["enrollment:update:taught", "enrollment:update:any"]),
  enrollmentController.update,
);
enrollmentRouter.delete(
  "/:id",
  requirePermission(["enrollment:delete:own", "enrollment:delete:any"]),
  enrollmentController.delete,
);
