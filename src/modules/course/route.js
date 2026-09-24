import Router from "express";
import { courseController } from "./controller";

export const courseRouter = Router();
courseController.post("/",courseController.create)//admin
courseRouter.get("/", courseController.list); //ins,admin,student
courseRouter.get("/:id", courseController.listDetails); //ins,admin,student
courseRouter.patch("/:id", courseController.update);//admin
courseRouter.delete("/:id", courseController.delete);//admin
