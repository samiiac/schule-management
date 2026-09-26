import Router from 'express'

export const enrollmentRoutes = Router()

enrollmentRoutes.post("/") //student or admin
enrollmentRoutes.get("/all") //admin 
enrollmentRoutes.get("/my") //student's enrolled course
enrollmentRoutes.get("/courses/:courseId") //admin or ins
enrollmentRoutes.patch("/:id") //by instructor (Once?)
enrollmentRoutes.delete("/:id") //by student or admin?