import Router from "express";
import { departmentController } from "./controller.js";
import { authenticate, requirePermission } from "../../middlewares/auth.js";
export const deptRouter = Router();

deptRouter.get(
  "/",
  authenticate,
  requirePermission(["department:read:any"]),
  departmentController.list,
); //all role? or
deptRouter.get(
  "/:id",
  authenticate,
  requirePermission(["department:read:any"]),
  departmentController.listDetails,
); //all role?
deptRouter.post(
  "/",
  authenticate,
  requirePermission(["department:create:any"]),
  departmentController.create,
); //permissiom :admin
deptRouter.delete(
  "/:id",
  authenticate,
  requirePermission(["department:delete:any"]),
  departmentController.delete,
); //admin
deptRouter.patch(
  "/:id",
  authenticate,
  requirePermission(["department:update:any"]),
  departmentController.update,
); //admin
