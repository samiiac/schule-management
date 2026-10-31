import { prisma } from "../../prisma/client.js";
import { calculateGPA } from "../../utils/gpa.js";
import { getPagination } from "../../utils/pagination.js";

export const enrollmentRepository = {
  create: async (tx, studentId, courseId) => {
    return tx.enrollment.create({ data: { studentId, courseId } });
  },
  listAll: async (input) => {
    const where = {
      ...(input.courseId ? { courseId: input.courseId } : {}),
      ...(input.studentId ? { studentId: input.studentId } : {}),
      ...(input.grade ? { grade: input.grade } : {}),
    };
    const [count, rows] = await prisma.$transaction([
      prisma.enrollment.count({ where }),
      prisma.enrollment.findMany({
        where,
        ...getPagination(input),
        include: {
          course: {
            select: {
              name: true,
              totalSeats: true,
            },
          },
          studentInfo: {
            select: {
              gpa: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);
    return [count, rows];
  },
  listForIns: async (courseId, input) => {
    const where = {
      courseId,
      ...(input.grade ? { grade: input.grade } : {}),
    };

    const [count, rows] = await prisma.$transaction([
      prisma.enrollment.count({ where: { courseId } }),
      prisma.enrollment.findMany({
        where,
        ...getPagination(input),

        include: {
          studentInfo: {
            select: {
              gpa: true,
              user: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      }),
    ]);
    return [count, rows];
  },
  listForStudent: async (studentId, input) => {
    const where = {
      studentId,
      ...(input.grade ? { grade: input.grade } : {}),
    };
    const [count, rows] = await prisma.$transaction([
      prisma.enrollment.count({ where }),
      prisma.enrollment.findMany({
        where,
        ...getPagination(input),

        include: {
          course: {
            select: {
              name: true,
              totalSeats: true,
              creditHours: true,
              isActive: true,
            },
          },
        },
      }),
    ]);
    return [count, rows];
  },
  update: async (tx, enrollmentId, grade) => {
    return prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        grade,
      },
    });
  },
  delete: (tx, id) => {
    return tx.enrollments.delete({ where: { id } });
  },
  findEnrollmentById: (id) => {
    return prisma.enrollments.findUnique({ where: { id } });
  },

  computeGPA: async (tx, studentId) => {
    const enrolls = await tx.enrollments.findMany({
      where: { studentId, grade: { not: "UG" } },
      include: {
        course: {
          select: {
            creditHours: true,
          },
        },
      },
    });

    const gpa = calculateGPA(enrolls);

    return tx.studentInfo.updateMany({
      where: { userId: studentId },
      data: {
        gpa,
      },
    });
  },
};
