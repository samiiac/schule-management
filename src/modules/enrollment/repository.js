import { getPagination } from "../../utils/pagination";

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
      prisma.enrollments.count({ where }),
      prisma.enrollments.findMany({
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
    return { count, rows };
  },
  listForIns: async (courseId, input) => {
    const where = {
      courseId,
      ...(input.grade ? { grade: input.grade } : {}),
    };

    const [count, rows] = await prisma.$transaction([
      prisma.enrollments.count({ where: { courseId } }),
      prisma.enrollments.findMany({
        where,
        ...getPagination(input),
        select: {
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
        },
      }),
    ]);
    return { count, rows };
  },
  listForStudent: (studentId) => {
    const where = {
      studentId,
      ...(input.grade ? { grade: input.grade } : {}),
    };
    return prisma.enrollments.findMany({
      where: { studentId },
      select: {
        include: {
          course: {
            select: {
              name: true,
              totalSeats: true,
              creditHours: true,
              isActive: true,
            },
          },
          department: {
            select: {
              name: true,
              isActive: true,
            },
          },
        },
      },
    });
  },
  //delete and update
};
