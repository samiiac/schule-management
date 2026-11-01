import Router from "express";
import { departmentController } from "./controller.js";
import { authenticate, requirePermission } from "../../middlewares/auth.js";
export const deptRouter = Router();

deptRouter.get(
  "/",
  requirePermission(["department:read:any"]),
  departmentController.list,
); //all role? or
deptRouter.get(
  "/:id",
  requirePermission(["department:read:any"]),
  departmentController.listDetails,
); //all role?
deptRouter.post(
  "/",
  requirePermission(["department:create:any"]),
  departmentController.create,
); //permissiom :admin
deptRouter.delete(
  "/:id",
  requirePermission(["department:delete:any"]),
  departmentController.delete,
); //admin
deptRouter.patch(
  "/:id",
  requirePermission(["department:update:any"]),
  departmentController.update,
); //admin
