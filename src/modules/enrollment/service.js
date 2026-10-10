import { courseRepository } from "../course/repository";
import { enrollmentRepository } from "./repository";

export const enrollmentService = {
  create: (studentId, courseId) => {
    return prisma.$transaction(async (tx) => {
      const course = await courseRepository.getCourseInfo(tx, courseId);
      if (!course) throw notFound("Course not found");
      if (!course.isActive) throw badRequest("Course inactive");

      const reserved = await courseRepository.reserveSeat(
        tx,
        courseId,
        course.totalSeats,
      );
      if (reserved.count === 0) throw conflict("Course is full");

      return enrollmentRepository.create(tx, studentId, courseId);
    });
  },
};
