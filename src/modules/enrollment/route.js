import Router from "express";
import { enrollmentController } from "./controller";
export const enrollmentRoutes = Router();

enrollmentRoutes.post(
  "/",
  requirePermission("enrollment:create:any", "enrollment:create:own"),
  enrollmentController.create
);
enrollmentRoutes.get("/all", requirePermission("enrollment:read:any"),enrollmentController.listForAdmin);
enrollmentRoutes.get("/my", requirePermission("enrollment:read:own"),enrollmentController.listForStudent);
enrollmentRoutes.get(
  "/courses/:courseId",
  requirePermission("enrollment:read:taught", "enrollment:read:any"),
  enrollmentController.listForIns
);
enrollmentRoutes.patch(
  "/:id",
  requirePermission("enrollment:update:taught", "enrollment:update:any"),
  enrollmentController.update
);
enrollmentRoutes.delete(
  "/:id",
  requirePermission("enrollment:delete:own", "enrollment:delete:any"),
  enrollmentController.delete
);
