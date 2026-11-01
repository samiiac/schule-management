import Router from "express";
import { courseController } from "./controller.js";
import { authenticate,requirePermission } from "../../middlewares/auth.js";

export const courseRouter = Router();
courseRouter.post("/",requirePermission(["course:create:any"]),courseController.create)//admin
courseRouter.get("/",requirePermission(["course:read:any"]),courseController.list); //ins,admin,student
courseRouter.get("/:id",requirePermission(["course:read:any"]), courseController.listDetails); //ins,admin,student
courseRouter.patch("/:id",requirePermission(["course:update:any"]), courseController.update);//admin
courseRouter.delete("/:id",requirePermission(["course:delete:any"]), courseController.delete);//admin
