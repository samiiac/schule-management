import { forbidden } from "../../utils/appError";
import { getPaginationMeta } from "../../utils/pagination";
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
  delete: (enrollmentId, user) => {
    return prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollments.findUnique({
        where: { id: enrollmentId },
      });
      if (!enrollment) {
        throw notFound("You are not enrolled.");
      }

      if (user.role != "ADMIN" && user.id != enrollment.studentId) {
        throw forbidden();
      }

      await courseRepository.releaseSeat(tx, enrollment.courseId);
      await enrollmentRepository.delete(tx, enrollmentId);
      await enrollmentRepository.computeGPA(tx, enrollment.studentId);
    });
  },
  update: async (enrollmentId, input) => {
    const { user, grade } = input;
    const enrollment =
      await enrollmentRepository.findEnrollmentById(enrollmentId);
    if (!enrollment) {
      throw notFound("You are not enrolled.");
    }

    const course = await courseRepository.getCourseInfo(enrollment.courseId);
    if (
      !course ||
      (user.role != "ADMIN" && !(course.instructorId === user.id))
    ) {
      throw forbidden();
    }

    return prisma.$transaction(async (tx) => {
      const updated = await enrollmentRepository.update(
        tx,
        enrollmentId,
        grade,
      );
      await enrollmentRepository.computeGPA(tx, enrollment.studentId);
      return updated;
    });
  },
  listForAdmin: async (input) => {
    const [count, rows] = await enrollmentRepository.listAll(input);
    return { data: rows, meta: getPaginationMeta(input, count) };
  },
  listForIns: async (input, courseId, user) => {
    const course = await courseRepository.getCourseInfo(courseId);
    if (!course || course.instructorId != user.id) {
      throw forbidden();
    }
    const [count, rows] = await enrollmentRepository.listForIns(
      courseId,
      input,
    );
    return { data: rows, meta: getPaginationMeta(input, count) };
  },
  listForStudent: async (studentId, input) => {
    const [count, rows] = await enrollmentRepository.listForStudent(
      studentId,
      input,
    );
    return { data: rows, meta: getPaginationMeta(input, count) };
  },
};
