import { getPagination } from "../../utils/pagination";

const where = {
  ...(input.courseId ? { courseId } : {}),
  ...(input.studentId ? { studentId } : {}),
  ...(input.grade ? { grade } : {}),
  ...(input.departmentId ? { departmentId } : {}),
};

export const enrollmentRepository = {
  create: async (studentId, courseId) => {
   
    return prisma.enrollments.create({
      data: {
        studentId,
        courseId,
      },
    });
  }, //check totalseats and enrollments
  listAll: async (input) => {
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
          department: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);
    return { count, rows };
  },
  listForCourse: async (courseId, input) => {
    const [count, rows] = await prisma.$transaction([
      prisma.enrollments.count({ where: { courseId } }),
      prisma.enrollments.findMany({
        where: { courseId },
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
  },//filters for list endpoint of student and ins
};
