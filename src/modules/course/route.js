import Router from "express";
import { courseController } from "./controller";
import { authenticate,requirePermission } from "../../middlewares/auth";

export const courseRouter = Router();
courseRouter.post("/",authenticate,requirePermission(["course:create:any"]),courseController.create)//admin
courseRouter.get("/", authenticate,requirePermission(["course:read:any"]),courseController.list); //ins,admin,student
courseRouter.get("/:id",authenticate,requirePermission(["course:read:any"]), courseController.listDetails); //ins,admin,student
courseRouter.patch("/:id",authenticate,requirePermission(["course:update:any"]), courseController.update);//admin
courseRouter.delete("/:id",authenticate,requirePermission(["course:delete:any"]), courseController.delete);//admin
